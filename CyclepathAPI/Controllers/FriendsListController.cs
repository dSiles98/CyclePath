using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CyclepathAPI.Repository;
using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace CyclepathAPI.Controllers
{
    //[Produces("application/json")]
    [Route("api/FriendsList")]
    [Authorize]
    public class FriendsListController : Controller
    {
        private FriendsListRepository _context;

        public FriendsListController(CyclepathDbContext context)
        {
            _context = new FriendsListRepository(context);
        }

        [HttpGet("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult GetFriends(string id)
        {
            var friends = _context.GetAll(id);
            if (friends is null)
            {
                return BadRequest();
            }
            return Ok(friends);
        }

        [HttpPost]
        [EnableCors("CorsPolicity")]
        public IActionResult Create([FromBody] FriendList friends)
        {
            try
            {
                _context.Create(friends);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpDelete("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult Delete(int id)
        {
            try
            {
                FriendList friend = _context.GetOne(id);
                _context.Delete(friend);
                return Ok();
            }
            catch(Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}