using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;


namespace CyclepathAPI.Repository
{
    public class RentPointRepository : ICrud<RentPoint, int>
    {
        protected CyclepathDbContext CyclepathDb { get; set; }

        public RentPointRepository(CyclepathDbContext cyclepathDb)
        {
            CyclepathDb = cyclepathDb;
        }

        /// <summary>
        /// this method add a new rentpoint on the database
        /// </summary>
        /// <param name="item"></param>
        public void Create(RentPoint item)
        {
            CyclepathDb.RentPoints.Add(item);
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// this method delete a rentpoint of the database
        /// </summary>
        /// <param name="id"></param>
        public void Delete(int id)
        {
            RentPoint rentPoint = GetOne(id);
            CyclepathDb.RentPoints.Remove(rentPoint);
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// this method change the cordinates and title of a rentpoint
        /// </summary>
        /// <param name="id"></param>
        /// <param name="item"></param>
        public void Edit(int id, RentPoint item)
        {
            RentPoint rentPoint = GetOne(id);
            rentPoint.Title = VerifyString(rentPoint.Title, item.Title);
            rentPoint.Direction = VerifyString(rentPoint.Direction, item.Direction);
            rentPoint.Latitude = VerifyCordinate(rentPoint.Latitude, item.Latitude);
            rentPoint.Longitude = VerifyCordinate(rentPoint.Longitude, item.Longitude);
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// this mehtod return all the rentpoints
        /// </summary>
        /// <returns></returns>
        public IEnumerable<RentPoint> GetAll()
        {
            return CyclepathDb.RentPoints.ToList();
        }

        /// <summary>
        /// this  method return one of the rentpoints
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public RentPoint GetOne(int id)
        {
            return (from rentPoint in CyclepathDb.RentPoints where rentPoint.Id == id select rentPoint).First();
        }

        /// <summary>
        /// this method verify if the cordinate is correct
        /// </summary>
        /// <param name="originalField"></param>
        /// <param name="newField"></param>
        /// <returns></returns>
        private double VerifyCordinate(double originalField, double newField)
        {
            double result = originalField;
            if (newField >= - 180 && newField <= 180)
            {
                result = newField;
            }
            return result;
        }

        /// <summary>
        /// this method verify if the field is not empty
        /// </summary>
        /// <param name="originalField"></param>
        /// <param name="newField"></param>
        /// <returns></returns>
        private string VerifyString(string originalField, string newField)
        {
            string result = originalField;
            if (newField != "")
            {
                result = newField;
            }
            return result;
        }

        public IEnumerable<RentPoint> GetAllFiltered(List<string> parameters, int? ownerId, IEnumerable<RentPoint> currentList)
        {
            List<RentPoint> result = currentList.ToList();
            List<RentPoint> aux = new List<RentPoint>();
            if (ownerId != null)
            {
                result = currentList.Where(rent => rent.OwnerId == ownerId).ToList();
            }
            if (parameters.Count > 0)
            {
                aux = result.Where(rent => parameters.Any(rent.Title.Contains)).ToList();
            }
            else
            {
                return result;
            }
            return aux;
        }
    }
}
