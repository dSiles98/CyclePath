using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using CyclepathAPI.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace CyclepathAPI.Controllers
{
    [Authorize]
    [Route("api/enlistments")]
    public class EnlistmentController : Controller
    {

        private EnlistmentRepository _context;
        public EnlistmentController(CyclepathDbContext context)
        {
            this._context = new EnlistmentRepository(context);
        }

        [HttpGet("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult GetEnlistment(int id)
        {
            var enlistments = _context.GetAll(id);
            if (enlistments is null)
            {
                return BadRequest();
            }
            return Ok(enlistments);
        }

        [HttpGet("my/{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult GetMyEnlistment(int id)
        {
            var enlistments = _context.GetMyAll(id);
            if (enlistments is null)
            {
                return BadRequest();
            }
            return Ok(enlistments);
        }

        [HttpDelete("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult DeleteEnlistment(int id)
        {
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



        [HttpPost]
        [EnableCors("CorsPolicity")]
        public IActionResult Create([FromBody] Enlistment enlistment)
        {
            try
            {
                _context.Create(enlistment);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}