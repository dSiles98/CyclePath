using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CyclepathAPI.Models;
using CyclepathAPI.Repository;
using CyclepathAPI.CyclepathDataBase;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Configuration;

namespace CyclepathAPI.Controllers
{
    [Produces("application/json")]
    [Route("api/Event")]
    [Authorize]
    public class EventController : Controller
    {
        private EventRepository eventRepository;

        public EventController(CyclepathDbContext context, IConfiguration configuration)
        {
            eventRepository = new EventRepository(context);
        }

        /// <summary>
        /// this method get all the Events filtered
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        [HttpGet()]
        [EnableCors("CorsPolicity")]
        public IEnumerable<Event> GetAllEvents(string search, int? ownerId)
        {
            List<string> parameters;
            IEnumerable<Event> result = eventRepository.GetAll();
            if (search != null || ownerId != 0)
            {
                parameters = new List<string>();
                if (search != null)
                {
                    parameters = search.Split(" ").ToList();
                }
                result = eventRepository.GetAllFiltered(parameters, ownerId, result);
            }
            return result;
        }

        /// <summary>
        /// this method get a specific Event 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult GetEvent(int id)
        {
            Event myEvent = eventRepository.GetOne(id);
            if (myEvent is null)
            {
                return NotFound();
            }
            return Ok(myEvent);
        }
        

        /// <summary>
        /// this method add a new Event
        /// </summary>
        /// <param name="myevent"></param>
        /// <returns></returns>
        [HttpPost]
        [EnableCors("CorsPolicity")]
        public IActionResult CreateEvent([FromBody] Event myevent)
        {
            try
            {
                eventRepository.Create(myevent);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// this method edit a Event
        /// </summary>
        /// <param name="id"></param>
        /// <param name="myEvent"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult EditEvent([FromBody] Event myEvent, int id)
        {
            try
            {
                eventRepository.Edit(id, myEvent);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// this method delete a Event
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult DeleteEvent(int id)
        {
            try
            {
                eventRepository.Delete(id);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}