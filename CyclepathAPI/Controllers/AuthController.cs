using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using CyclepathAPI.Repository;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace CyclepathAPI.Controllers
{
    [Route("api/auth")]
    [Authorize]
    public class AuthController : Controller
    {
        private AccountRepository _context;
        private ThemesRepository _themesContext;
        private LanguageRepository _languageContext;
        public AuthController(CyclepathDbContext context, IConfiguration configuration)
        {
            _context = new AccountRepository(context, configuration);
            _themesContext = new ThemesRepository(context, configuration);
            _languageContext = new LanguageRepository(context, configuration);
        }

        /// <summary>
        /// the method allow to loggin to get a unique jwt.
        /// search the account and compare if the password match.
        /// </summary>
        /// <returns></returns>
        [HttpGet("token")]
        [EnableCors("CorsPolicity")]
        [AllowAnonymous]
        public IActionResult Token()
        {
            //string tokenString = "test";
            var header = Request.Headers["Authorization"];
            if (header.ToString().StartsWith("Basic"))
            {
                var credValue = header.ToString().Substring("Basic ".Length).Trim();
                var usernameAndPassenc = Encoding.UTF8.GetString(Convert.FromBase64String(credValue)); //admin:pass
                var usernameAndPass = usernameAndPassenc.Split(":");
                //check in DB username and pass exist

                var account = _context.GetOne(usernameAndPass[0]);
                if (account is null || !account.EmailVerified)
                {
                    return BadRequest();
                }
                var password = AccountController.CreateHash(usernameAndPass[1]);
                usernameAndPass[1] = password;
                if (account.Password != usernameAndPass[1])
                {
                    return Unauthorized();
                }
                var claimsdata = new[] { new Claim(ClaimTypes.Name, usernameAndPass[0])};
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ahbasshfbsahjfbshajbfhjasbfashjbfsajhfvashjfashfbsahfbsahfksdjf"));
                var signInCred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
                var token = new JwtSecurityToken(
                     issuer: "mysite.com",
                     audience: "mysite.com",
                     expires: DateTime.Now.AddDays(62),
                     claims: claimsdata,
                     signingCredentials: signInCred
                    );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                var theme = _themesContext.GetOne(account.ThemeId);
                var language = _languageContext.GetOne(account.LanguageId);
                return Ok(new string[] { tokenString, theme.Theme, language.LanguageAccount });
            }
            return BadRequest("bad request");
        }
    }
}