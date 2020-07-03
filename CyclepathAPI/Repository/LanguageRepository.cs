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
    public class LanguageRepository
    {
        protected CyclepathDbContext CyclepathDbContext { get; set; }
        public IConfiguration Configuration { get; }

        /// <param name="cyclepathDbContext">Database</param>
        public LanguageRepository(CyclepathDbContext cyclepathDbContext, IConfiguration configuration)
        {
            Configuration = configuration;
            CyclepathDbContext = cyclepathDbContext;
        }

        public Language GetOne(int id)
        {
            Language result = CyclepathDbContext.Languages.Find(id);
            if (result == null)
            {
                throw new Exception("Language not found");
            }
            return result;
        }

        public int GetOne(Operation<Account> operation)
        {
            Language result = CyclepathDbContext.Languages.Where(language => language.LanguageAccount == operation.value.ToString()).First();
            if (result == null)
            {
                throw new Exception("Language not found");
            }
            return result.Id;
        }
    }
}
