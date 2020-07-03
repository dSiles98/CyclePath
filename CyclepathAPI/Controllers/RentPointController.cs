using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using CyclepathAPI.Repository;
using Microsoft.AspNetCore.Cors;

namespace CyclepathAPI.Controllers
{
    [Route("api/rent-point")]
    [Authorize]
    public class RentPointController : Controller
    {
        private RentPointRepository rentPointRepository;

        public RentPointController(CyclepathDbContext context)
        {
            rentPointRepository = new RentPointRepository(context);
        }

        /// <summary>
        /// this method get all the rentpoints filtered
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        [HttpGet()]
        [EnableCors("CorsPolicity")]
        public IEnumerable<RentPoint> GetAllRentPoints(string search, int? ownerId)
        {
            List<string> parameters;
            IEnumerable<RentPoint> result = rentPointRepository.GetAll();
            if (search != null || ownerId != 0)
            {
                parameters = new List<string>();
                if (search != null)
                {
                    parameters = search.Split(" ").ToList();
                }
                result = rentPointRepository.GetAllFiltered(parameters, ownerId, result);
            }
            return result;
        }

        /// <summary>
        /// this method get a specific rentpoint 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult GetRentPoint(int id)
        {
            RentPoint rentPoint = rentPointRepository.GetOne(id);
            if (rentPoint is null)
            {
                return NotFound();
            }
            return Ok(rentPoint);
        }

        /// <summary>
        /// this method add a new rentpoint
        /// </summary>
        /// <param name="rentPoint"></param>
        /// <returns></returns>
        [HttpPost]
        [EnableCors("CorsPolicity")]
        public IActionResult CreateRentPoint([FromBody] RentPoint rentPoint)
        {
            try
            {
                rentPointRepository.Create(rentPoint);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// this method edit a rentpoint
        /// </summary>
        /// <param name="id"></param>
        /// <param name="rentPoint"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult EditRentPoint([FromBody] RentPoint rentPoint, int id)
        {
            try
            {
                rentPointRepository.Edit(id, rentPoint);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// this method delete a rentpoint
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult DeleteRentPoint(int id)
        {
            try
            {
                rentPointRepository.Delete(id);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}
