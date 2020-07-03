using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using CyclepathAPI.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.JsonPatch;

namespace CyclepathAPI.Controllers
{
    /// <summary>
    /// this is the route of accounts
    /// </summary>
    [Route("api/account")]
    [Authorize]
    public class AccountController : Controller
    {
        private AccountRepository _context;
        private ThemesRepository _themeContext;
        private LanguageRepository _languageContext;
        private MD5CryptoServiceProvider crypt;
        public AccountController(CyclepathDbContext context, IConfiguration configuration)
        {
            _context = new AccountRepository(context, configuration);
            _themeContext = new ThemesRepository(context, configuration);
            _languageContext = new LanguageRepository(context, configuration);
            crypt = new MD5CryptoServiceProvider();
        }

        /// <summary>
        /// this method allow get all accounts.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [EnableCors("CorsPolicity")]
        public IEnumerable<Account> GetAllAccounts()
        {
            var users = _context.GetAll();
            List<Account> accounts = new List<Account>();
            Json json = new Json();
            List<string> args = new List<string>() { "Password", "Lastname", "Birthday", "Email" };
            foreach (Account account in users)
            {
                Account user = json.Serialize(account, true, args);
                accounts.Add(user);
            }
            return accounts;
        }

        /// <summary>
        /// This method allow get an account by username.
        /// </summary>
        /// <param name="id">username</param>
        /// <returns></returns>
        [EnableCors("CorsPolicity")]
        [HttpGet("{id}", Name = "account")]
        public IActionResult GetAccount(string id)
        {
            var account = _context.GetOne(id);
            if (account is null)
            {
                return NotFound(Request.Headers["Authorization"]);
            }
            Json json = new Json();
            List<string> args = new List<string>() { "Password" };
            var user = json.Serialize(account, true, args);
            return Ok(user);
        }

        /// <summary>
        /// This method allow get an account by id.
        /// </summary>
        /// <param name="id">username</param>
        /// <returns></returns>
        [EnableCors("CorsPolicity")]
        [HttpGet("id/{id}")]
        public IActionResult GetAccountByID(int id)
        {
            var account = _context.GetOneByID(id);
            if (account is null)
            {
                return NotFound(Request.Headers["Authorization"]);
            }
            Json json = new Json();
            List<string> args = new List<string>() { "Password" };
            var user = json.Serialize(account, true, args);
            return Ok(user);
        }


        /// <summary>
        /// This method allow create an account.
        /// </summary>
        /// <param name="account"></param>
        [HttpPost]
        [EnableCors("CorsPolicity")]
        [AllowAnonymous]
        public IActionResult CreateAccount([FromBody] Account account)
        {
            var password = CreateHash(account.Password);
            account.Password = password;
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _context.Create(account);
                return Ok();
            }
            catch(Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// This method allow edit an account by id.
        /// </summary>
        /// <param name="id">username</param>
        /// <param name="account"></param>
        /// 
        [EnableCors("CorsPolicity")]
        [HttpPut("{id}")]
        public IActionResult EditAccount(string id, [FromBody] Account account)
        {
            try
            {
                _context.Edit(id, account);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// This method allow delete an account by id.
        /// </summary>
        /// <param name="id">username</param>
        [HttpDelete("{id}")]
        [EnableCors("CorsPolicity")]
        [AllowAnonymous]
        public IActionResult DeleteAccount(string id)
        {
            var header = Request.Headers["Authorization"];
            if (header.ToString().StartsWith("Basic"))
            {
                var credValue = header.ToString().Substring("Basic ".Length).Trim();
                var usernameAndPassenc = Encoding.UTF8.GetString(Convert.FromBase64String(credValue)); //admin:pass
                var usernameAndPass = usernameAndPassenc.Split(":");
                //check in DB username and pass exist

                var account = _context.GetOne(usernameAndPass[0]);
                if (account is null)
                {
                    return Unauthorized();
                }
                var password = CreateHash(usernameAndPass[1]);
                usernameAndPass[1] = password;
                if (account.Password != usernameAndPass[1] || usernameAndPass[0] != id)
                {
                    return Unauthorized();
                }
                try
                {
                    _context.Delete(id);
                    return Ok();
                }
                catch (Exception exe)
                {
                    return BadRequest(exe.Message);
                }
            }
            return BadRequest("bad request");
            
        }

        [HttpPatch("{username}")]
        [EnableCors("CorsPolicity")]
        public IActionResult PatchAccount(string username, [FromBody]JsonPatchDocument<Account> newAccount)
        {
            /*
            this endpoint modifies the event given an id and an Price model that is necessary to specify which property of an object 
            the user wishes to modify and make sure that the data that is inserted follows the rules that have the Price model
            The body should be as follows:
            "op" is the operation to be performed
            "path" is the parameter to be changed
            "value" is the new value
            */
            var operation = newAccount.Operations.First().path.ToLower();
            var account = _context.GetOne(username);
            switch (operation)
            {
                case "/themeid":
                    var themeId = _themeContext.GetOne(newAccount.Operations.First());
                    newAccount.Operations.First().value = themeId;
                    _context.Patch(account, newAccount);
                    return Ok(account);
                case "/languageid":
                    var languageId = _languageContext.GetOne(newAccount.Operations.First());
                    newAccount.Operations.First().value = languageId;
                    _context.Patch(account, newAccount);
                    return Ok(account);
                default:
                    if (account is null)
                    {
                        return NotFound();
                    }
                    _context.Patch(account, newAccount);
                    return Ok(account);
            }
        }

        /// <summary>
        /// this method verify the email of a user
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        [HttpGet("verifyemail/{username}")]
        [EnableCors("CorsPolicity")]
        [AllowAnonymous]
        public string VerifyEmail(string username)
        {
            try
            {
                _context.VerifyEmail(username);
                return "email verified";
            }
            catch (Exception exe)
            {
                return exe.Message;
            }
        }

        /// <summary>
        /// this method recover the password of a user
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        [HttpGet("recoverpassword/{username}")]
        [EnableCors("CorsPolicity")]
        [AllowAnonymous]
        public IActionResult RecoverPassword(string username)
        {
            try
            {
                _context.RecoverPassword(username);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [EnableCors("CorsPolicity")]
        [HttpPut("{id}/password")]
        public IActionResult EditPassword(string id, [FromBody] ChangePasswordData data)
        {
            string password;
            if (data.NewPassword == "" || data.NewPassword == null)
            {
                return BadRequest("Password can't be empty or null");
            }
            try
            {
                if (_context.GetOne(id).Password == CreateHash(data.Password))
                {
                    password = CreateHash(data.NewPassword);
                    _context.EditPassword(id, password);
                    return Ok();
                }
                else
                {
                    return BadRequest("Wrong Password");
                }
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }


        /// <summary>
        /// encrypt a word
        /// </summary>
        /// <param name="unHashed">the word to encrypt</param>
        /// <returns>return the hashed word</returns>
        public static string CreateHash(string unHashed)
        {
            var x = new MD5CryptoServiceProvider();
            var data = Encoding.ASCII.GetBytes(unHashed);
            data = x.ComputeHash(data);
            return Encoding.ASCII.GetString(data);
        }
    }
}