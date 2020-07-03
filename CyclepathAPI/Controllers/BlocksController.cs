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
    [Route("api/Blocks")]
    public class BlocksController : Controller
    {

        private BlockListRepository _context;
        public BlocksController(CyclepathDbContext context)
        {
            this._context = new BlockListRepository(context);
        }

        [HttpGet("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult GetBlocks(int id)
        {
            var blocks = _context.GetAll(id);
            if (blocks is null)
            {
                return BadRequest();
            }
            return Ok(blocks);
        }

        [HttpDelete("{id}")]
        [EnableCors("CorsPolicity")]
        public IActionResult DeleteBlock(int id)
        {
            try {
                _context.Delete(id);
                return Ok();
            } catch (Exception exe) {
                return BadRequest(exe.Message);
            }
            
        }



        [HttpPost]
        [EnableCors("CorsPolicity")]
        public IActionResult Create([FromBody] BlockList block)
        {
            try
            {
                _context.Create(block);
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}