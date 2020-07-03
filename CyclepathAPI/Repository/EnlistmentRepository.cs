using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Repository
{
    public class EnlistmentRepository
    {
        protected CyclepathDbContext CyclepathDbContext { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cyclepathDbContext">Database</param>
        public EnlistmentRepository(CyclepathDbContext cyclepathDbContext)
        {
            this.CyclepathDbContext = cyclepathDbContext;
        }

        public void Create(Enlistment enlistment)
        {
            try
            {
                CyclepathDbContext.Enlistments.Add(enlistment);
                CyclepathDbContext.SaveChanges();
            }
            catch (Exception exe)
            {
                throw exe.InnerException;
            }
        }

        public Enlistment GetOne(int id)
        {
            var enlistments = CyclepathDbContext.Enlistments.Where(enlistment => enlistment.Id == id).ToList();
            return enlistments[0];
        }

        public IEnumerable<Enlistment> GetAll(int id)
        {
            var enlistments = CyclepathDbContext.Enlistments.Where(enlistment => enlistment.IdEvent == id).ToList();
            return enlistments;
        }

        public IEnumerable<Enlistment> GetMyAll(int id)
        {
            var enlistments = CyclepathDbContext.Enlistments.Where(enlistment => enlistment.IdAccount == id).ToList();
            return enlistments;
        }

        public void Edit(int id, BlockList account)
        {
            throw new NotImplementedException();
        }
        public void Update(string id, FriendList account)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            Enlistment enlistment = GetOne(id);
            this.CyclepathDbContext.Enlistments.Remove(enlistment);
            CyclepathDbContext.SaveChanges();
        }

        public IEnumerable<FriendList> GetAll()
        {
            throw new NotImplementedException();
        }
    }
}