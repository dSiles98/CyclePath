using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Repository
{
    interface ICrud<TEntity, U> where TEntity : class
    {
        IEnumerable<TEntity> GetAll();
        TEntity GetOne(U id);
        void Create(TEntity item);
        void Edit(U id, TEntity item);
        void Delete(U id);
    }
}
