using CyclepathAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CyclepathAPI.Hubs
{

    public class SessionsHandlerHub: Hub
    {
        public async Task CloseSessions(string clientMethod, string message)
        {
            string ya = Context.UserIdentifier;
            await Clients.User(Context.UserIdentifier).SendAsync(clientMethod, message);
            string voy = Context.UserIdentifier;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
