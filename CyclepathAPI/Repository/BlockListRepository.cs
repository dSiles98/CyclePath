using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Repository
{
    public class BlockListRepository
    {
        protected CyclepathDbContext CyclepathDbContext { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cyclepathDbContext">Database</param>
        public BlockListRepository(CyclepathDbContext cyclepathDbContext)
        {
            this.CyclepathDbContext = cyclepathDbContext;
        }

        public void Create(BlockList toBlock)
        {
            try
            {
                CyclepathDbContext.Blocks.Add(toBlock);
                CyclepathDbContext.SaveChanges();
            }
            catch(Exception exe)
            {
                throw exe.InnerException;
            }
        }

        public BlockList GetOne(int id)
        {
            var block = CyclepathDbContext.Blocks.Where(blocked => blocked.Id == id).ToList();
            return block[0];
        }

        public IEnumerable<BlockList> GetAll(int id)
        {
            var blocks = CyclepathDbContext.Blocks.Where(blocked => blocked.IdOwner == id).ToList();
            return blocks;
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
            BlockList block = GetOne(id);
            CyclepathDbContext.Blocks.Remove(block);
            CyclepathDbContext.SaveChanges();
        }

        public IEnumerable<FriendList> GetAll()
        {
            throw new NotImplementedException();
        }
    }
}