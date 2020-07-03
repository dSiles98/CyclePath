using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;

namespace CyclepathAPI.Providers
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        /// <summary>
        /// This method is called when to start a real-time client-server connection
        /// by assigning a user identifier to the connection attached to the string returned by the method
        /// </summary>
        /// <param name="connection">This is the hub connection context</param>
        /// <returns>Return a string which is the user name</returns>
        public virtual string GetUserId(HubConnectionContext connection)
        {
            var tokenString = connection.GetHttpContext().Request.Query["access_token"].ToString();
            JwtSecurityToken token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);
            var username = token.Claims.Where(claim => claim.Type == ClaimTypes.Name).First().Value.ToLower();
            return username;
            //return connection.User?.FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}
