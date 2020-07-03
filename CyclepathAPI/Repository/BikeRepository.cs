using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace CyclepathAPI.Repository
{
    public class BikeRepository : ICrud<Bike, int>
    {
        protected CyclepathDbContext CyclepathDb { get; set; }
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cyclepathDb"></param>
        public BikeRepository(CyclepathDbContext cyclepathDb)
        {
            CyclepathDb = cyclepathDb;
        }

        /// <summary>
        /// This method return all the bikes in the database
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Bike> GetAll()
        {
            return CyclepathDb.Bikes;
        }

        /// <summary>
        /// This method return the bikes in one rentpoint
        /// </summary>
        /// <param name="rentPointId"></param>
        /// <returns></returns>
        public IEnumerable<Bike> GetRentPointBikes(int rentPointId)
        {
            return (from bike in CyclepathDb.Bikes where bike.RentPointId == rentPointId select bike).ToList();
        }

        /// <summary>
        /// this method return a bike by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Bike GetOne(int id)
        {
            return (from bike in CyclepathDb.Bikes where bike.Id == id select bike).First();
        }

        /// <summary>
        /// this method add a new bike
        /// </summary>
        /// <param name="item"></param>
        public void Create(Bike item)
        {
            CyclepathDb.Bikes.Add(item);
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// this method edit the description and price of one bike
        /// </summary>
        /// <param name="id"></param>
        /// <param name="item"></param>
        public void Edit(int id, Bike item)
        {
            Bike bike = GetOne(id);
            bike.Price = VerifyPrice(bike.Price, item.Price);
            bike.Description = VerifyDescription(bike.Description, item.Description);
            bike.Image = item.Image;
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// This method verify if the new description is empty and return the correct description
        /// </summary>
        /// <param name="description1"></param>
        /// <param name="description2"></param>
        /// <returns></returns>
        private string VerifyDescription(string description1, string description2)
        {
            string description = description1;
            if (description2 != "")
            {
                description = description2;
            }
            return description;
        }

        /// <summary>
        /// this method verify is the new price is valid and return the correct price
        /// </summary>
        /// <param name="price1"></param>
        /// <param name="price2"></param>
        /// <returns></returns>
        private double VerifyPrice(double price1, double price2)
        {
            double price = price1;
            if (price2 > 0)
            {
                price = price2;
            }
            return price;
        }

        /// <summary>
        /// this method delete a bike
        /// </summary>
        /// <param name="id"></param>
        public void Delete(int id)
        {
            Bike bike = GetOne(id);
            CyclepathDb.Bikes.Remove(bike);
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// this method edit reservation disponibility status
        /// </summary>
        /// <param name="id"></param>
        /// <param name="newBike"></param>
        public void EditReservationDisponibility(int id, Bike newBike) {
            Bike bike = GetOne(id);
            bike.Disponible = newBike.Disponible;
            CyclepathDb.SaveChanges();
        }

        public int Count()
        {
            return CyclepathDb.Bikes.Count();
        }
    }
}
