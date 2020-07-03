using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Repository
{
    public class EventRepository
    {
        protected CyclepathDbContext CyclepathDb { get; set; }

        public EventRepository(CyclepathDbContext cyclepathDb)
        {
            this.CyclepathDb = cyclepathDb;
        }

        /// <summary>
        /// this method add a new Event on the database
        /// </summary>
        /// <param name="item"></param>
        public void Create(Event item)
        {
            CyclepathDb.Events.Add(item);
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// this method delete a Event of the database
        /// </summary>
        /// <param name="id"></param>
        public void Delete(int id)
        {
            Event myEvent = GetOne(id);
            this.CyclepathDb.Events.Remove(myEvent);
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// this method change data of an Event
        /// </summary>
        /// <param name="id"></param>
        /// <param name="item"></param>
        public void Edit(int id, Event item)
        {
            Event myEvent = GetOne(id);
            myEvent.Name = VerifyString(myEvent.Name, item.Name);
            myEvent.Latitude = VerifyCordinate(myEvent.Latitude, item.Latitude);
            myEvent.Longitude = VerifyCordinate(myEvent.Longitude, item.Longitude);
            myEvent.EventDate = VerifiyField(myEvent.EventDate, item.EventDate);
            myEvent.RouteId = int.Parse(VerifiyField(myEvent.RouteId.ToString(), item.RouteId.ToString()));
            CyclepathDb.SaveChanges();
        }

        /// <summary>
        /// this mehtod return all the Events
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Event> GetAll()
        {
            return this.CyclepathDb.Events.ToList();
        }
        
        /// <summary>
        /// this  method return one of the Events
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Event GetOne(int id)
        {
            return (from myEvent in this.CyclepathDb.Events where myEvent.Id == id select myEvent).First();
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
            if (newField >= -180 && newField <= 180)
            {
                result = newField;
            }
            return result;
        }

        /// <summary>
        /// This method allow verified the fields for the Event.
        /// </summary>
        /// <param name="currentField">current data</param>
        /// <param name="field">data to replace</param>
        /// <returns></returns>
        private string VerifiyField(string currentField, string field)
        {
            string result = field;
            if (String.IsNullOrWhiteSpace(field))
            {
                result = currentField;
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

        /// <summary>
        /// This method returns all the data by filter if given
        /// </summary>
        /// <param name="parameters"></param>
        /// <param name="ownerId"></param>
        /// <param name="currentList"></param>
        /// <returns></returns>
        public IEnumerable<Event> GetAllFiltered(List<string> parameters, int? ownerId, IEnumerable<Event> currentList)
        {
            List<Event> result = currentList.ToList();
            List<Event> aux = new List<Event>();
            if (ownerId != null)
            {
                result = currentList.Where(myEvent => myEvent.OwnerId == ownerId).ToList();
            }
            if (parameters.Count > 0)
            {
                aux = result.Where(myEvent => parameters.Any(myEvent.Name.Contains)).ToList();
            }
            else
            {
                return result;
            }
            return aux;
        }

    }
}
