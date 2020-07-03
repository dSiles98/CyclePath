using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using CyclepathAPI.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CyclepathAPI.Controllers
{
    [Authorize]
    [EnableCors("CorsPolicity")]
    [Produces("application/json")]
    [Route("api/route")]
    public class RoutesController : Controller
    {
        private RoutesRepository _context;

        /// <summary>
        /// data base
        /// </summary>
        /// <param name="context"></param>
        public RoutesController(CyclepathDbContext context)
        {
            _context = new RoutesRepository(context);
        }

        [HttpGet("owner/{owner}")]
        public IEnumerable<Route> GetRoutesOf(string owner)
        {
            return _context.GetOf(owner);
        }

        [HttpGet]
        public IEnumerable<Route> GetRoutes(string category, string city, string user = "")
        {
            return _context.GetAllRoutes(category, city, user);
        }

        /// <summary>
        /// This method serach a route by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}", Name = "GetRouteById")]
        public IActionResult GetRoute(int id)
        {
            try
            {
                var route = _context.GetOne(id);
                return Ok(route);
            }
            catch (Exception exe)
            {
                return NotFound(exe.Message);
            }
        }

        /// <summary>
        /// This method allow create new route.
        /// </summary>
        /// <param name="route"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult CreateRoute([FromBody] Route route)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                _context.Create(route);
                return new CreatedAtRouteResult("GetRouteById", new { id = route.Id }, route);

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// This method allow edit a route.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="route"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public IActionResult EditRoute(int id, [FromBody] Route route)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            else
            {
                _context.Edit(id, route);
                return new CreatedAtRouteResult("GetRouteById", new { id = route.Id }, route);
            }
        }

        /// <summary>
        /// This method allow delete aroute.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public IActionResult DeleteRoute(int id)
        {
            try
            {
                _context.Delete(id);
                return Ok();
            }
            catch (Exception exe)
            {
                return NotFound(exe.Message);
            }
        }
    }
}