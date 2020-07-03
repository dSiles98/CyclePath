using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CyclepathAPI.Repository;
using CyclepathAPI.CyclepathDataBase;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using CyclepathAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using System.Security.Cryptography;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CyclepathAPI.Controllers
{
    [Route("api/messages")]
    [Authorize]
    public class MessageController : Controller
    {
        private MessageRepository _context;
        private AccountRepository _contextA;
        private MD5CryptoServiceProvider crypt;
        /// <summary>
        /// the constructor of the controller
        /// </summary>
        /// <param name="context">conection to the db</param>
        public MessageController(CyclepathDbContext context, IConfiguration configuration)
        {
            _context = new MessageRepository(context);
            _contextA = new AccountRepository(context, configuration);
            crypt = new MD5CryptoServiceProvider();
        }
        /// <summary>
        /// verify if the password and the user is correct
        /// </summary>
        /// <param name="header">a basic auth</param>
        /// <returns></returns>
        private Account VerifyBasic(StringValues header )
        {
            if (header.ToString().StartsWith("Basic"))
            {
                var credValue = header.ToString().Substring("Basic ".Length).Trim();
                var usernameAndPassenc = Encoding.UTF8.GetString(Convert.FromBase64String(credValue)); //admin:pass
                var usernameAndPass = usernameAndPassenc.Split(":");
                var account = _contextA.GetOne(usernameAndPass[0]);
                if (account is null)
                {
                    return null;
                }
                var password = AccountController.CreateHash(usernameAndPass[1]);
                usernameAndPass[1] = password;
                if (account.Password != usernameAndPass[1])
                {
                    return null;
                }
                return account;
            }
            return null;
        }

        /// <summary>
        /// this method get all the messages of one side of a conversation
        /// </summary>
        /// <param name="IdOwner"></param>
        /// <param name="idAdressee"></param>
        /// <returns></returns>
        [HttpGet("{IdOwner}/To/{idAdressee}")]
        [EnableCors("CorsPolicity")]
        public IActionResult GetAllMessages(int IdOwner, int idAdressee)
        {
            var tokenString = Request.Headers["Authorization"].ToString().Substring("Bearer ".Length).Trim();
            JwtSecurityToken token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);
            var username = token.Claims.Where(claim => claim.Type == ClaimTypes.Name).First().Value;
            var account = _contextA.GetOne(username);
            if (account is null)
            {
                return Unauthorized();
            }
            if (account.Id != IdOwner && account.Id != idAdressee)
            {
                return Unauthorized();
            }
            IEnumerable<Message> result = _context.GetConversation(IdOwner, idAdressee);
            return Ok(result);
        }

        [HttpGet("{IdOwner}")]
        [EnableCors("CorsPolicity")]
        public IActionResult GetAllConversations(int IdOwner)
        {
            IEnumerable<Conversation> result = _context.GetConversations(IdOwner);
            return Ok(result);
        }

        /// <summary>
        /// set the delivered info to true
        /// </summary>
        /// <param name="id"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult SetDelivered(int id,[FromBody] Message message)
        {
            try
            {
                _context.Edit(id, message);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// post a message.
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        [HttpPost]
        [EnableCors("CorsPolicity")]
        public IActionResult CreateMessage([FromBody] Message message)
        {
            var tokenString = Request.Headers["Authorization"].ToString().Substring("Bearer ".Length).Trim();
            JwtSecurityToken token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);
            var username = token.Claims.Where(claim => claim.Type == ClaimTypes.Name).First().Value;
            var account = _contextA.GetOne(username);
            if (account is null)
            {
                return Unauthorized();
            }
            if (account.Id != message.OwnerId && account.Id != message.Addressee)
            {
                return Unauthorized();
            }
            try
            {
                _context.Create(message);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}