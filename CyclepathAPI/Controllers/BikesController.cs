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
    [Produces("application/json")]
    [Authorize]
    public class BikesController : Controller
    {
        private BikeRepository bikesRepository;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context"></param>
        public BikesController(CyclepathDbContext context)
        {
            bikesRepository = new BikeRepository(context);
        }

        /// <summary>
        /// This method get the bikes of a rentpoint
        /// </summary>
        /// <param name="rentPointId"></param>
        /// <returns></returns>
        [Route("api/rent-point/{rentPointId}/bikes")]
        [HttpGet()]
        [EnableCors("CorsPolicity")]
        public IEnumerable<Bike> GetBikesFromRentPoint(int rentPointId)
        {
            return bikesRepository.GetRentPointBikes(rentPointId);
        }

        /// <summary>
        /// this method get a bike of a rent point
        /// </summary>
        /// <param name="rentPointId"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [Route("api/rent-point/{rentPointId}/bikes/{id}")]
        [HttpGet()]
        [EnableCors("CorsPolicity")]
        public IActionResult GetBike(int rentPointId, int id)
        {
            var bike = bikesRepository.GetOne(id);
            if (bike is null || bike.RentPointId != rentPointId)
            {
                return NotFound();
            }
            return Ok(bike);
        }

        /// <summary>
        /// This method add a new bike
        /// </summary>
        /// <param name="rentPointId"></param>
        /// <param name="bike"></param>
        /// <returns></returns>
        [Route("api/rent-point/{rentPointId}/bikes")]
        [HttpPost()]
        [EnableCors("CorsPolicity")]
        public IActionResult PostBike(int rentPointId, [FromBody] Bike bike)
        {
            try
            {
                bike.RentPointId = rentPointId;
                bike.Disponible = true;
                bikesRepository.Create(bike);
                return Ok();
            }
            catch (System.Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// this method edit description and price of a bike in a rentpoint
        /// </summary>
        /// <param name="id"></param>
        /// <param name="bike"></param>
        /// <returns></returns>
        [Route("api/rent-point/{rentPointId}/bikes/{id}")]
        [HttpPut()]
        [EnableCors("CorsPolicity")]
        public IActionResult PutBike(int id, [FromBody] Bike bike)
        {
            try
            {
                bikesRepository.Edit(id, bike);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// this method delete a bike
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Route("api/bikes/{id}")]
        [HttpDelete()]
        [EnableCors("CorsPolicity")]
        public IActionResult DeleteBike(int id)
        {
            try
            {
                bikesRepository.Delete(id);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        /// <summary>
        /// this method edit the reservation status of a rentpoint
        /// </summary>
        /// <param name="id"></param>
        /// <param name="bike"></param>
        /// <returns></returns>
        [Route("api/bikes/{id}")]
        [HttpPut()]
        [EnableCors("CorsPolicity")]
        public IActionResult PutBikeDispnibility(int id, [FromBody] Bike bike)
        {
            try
            {
                bikesRepository.EditReservationDisponibility(id, bike);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}