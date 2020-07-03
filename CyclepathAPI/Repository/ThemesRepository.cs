using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Repository
{
    public class ThemesRepository
    {
        protected CyclepathDbContext CyclepathDbContext { get; set; }
        public IConfiguration Configuration { get; }

        /// <param name="cyclepathDbContext">Database</param>
        public ThemesRepository(CyclepathDbContext cyclepathDbContext, IConfiguration configuration)
        {
            Configuration = configuration;
            CyclepathDbContext = cyclepathDbContext;
        }

        public Themes GetOne(int id)
        {
            Themes result = CyclepathDbContext.Themes.Find(id);
            if (result == null)
            {
                throw new Exception("theme not found");
            }
            return result;
        }

        public int GetOne(Operation<Account> operation)
        {
            Themes result = CyclepathDbContext.Themes.Where(theme => theme.Theme == operation.value.ToString()).First();
            if (result == null)
            {
                throw new Exception("theme not found");
            }
            return result.Id;
        }
    }
}
