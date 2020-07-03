using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;


namespace CyclepathAPI.Repository
{
    public class RoutesRepository : ICrud<Route, int>
    {
        protected CyclepathDbContext CyclepathDbContext { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cyclepathDbContext">Database</param>
        public RoutesRepository(CyclepathDbContext cyclepathDbContext)
        {
            this.CyclepathDbContext = cyclepathDbContext;
        }

        /// <summary>
        /// This method allow create a new route
        /// </summary>
        /// <param name="item">route</param>
        public void Create(Route item)
        {
            var route = CyclepathDbContext.Routes.Add(item);
            CyclepathDbContext.SaveChanges();
        }

        /// <summary>
        /// This method allow delete a route by id.
        /// </summary>
        /// <param name="id">route id</param>
        public void Delete(int id)
        {
            Route route = GetOne(id);
            if (route != null)
            {
                CyclepathDbContext.Routes.Remove(route);
                CyclepathDbContext.SaveChanges();
            }
            else
            {
                throw new Exception($"Cannot Delete the Route With {id}");
            }
        }

        /// <summary>
        /// This method allow edit a route by id,
        /// Just can edit his category and checkpoints
        /// </summary>
        /// <param name="id">route id</param>
        /// <param name="item">route to edit</param>
        public void Edit(int id, Route item)
        {
            Route route = GetOne(id);
            if (route != null)
            {
                route.Category = item.Category;
                route.Address = item.Address;
                var checkpointList = item.Checkpoints.ToList();
                route.Checkpoints = checkpointList;
                CyclepathDbContext.SaveChanges();
            }
            else
            {
                throw new Exception($"Cannot Edit the Route With {id}");
            }
        }

        /// <summary>
        /// This method returns all routes created.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Route> GetAll()
        {
            var routes = CyclepathDbContext.Routes.ToList();
            foreach (Route route in routes)
            {
                var checkpoints = CyclepathDbContext.Checkpoints.Where(checkpoint => checkpoint.RouteId == route.Id).ToList();
                route.Checkpoints = checkpoints;
            }
            CyclepathDbContext.SaveChanges();
            return routes;
        }

        /// <summary>
        /// This method filter checkpoints by category
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        public IEnumerable<Route> GetAll(string search)
        {
            var routes = GetAll();
            if (search != null)
            {
                var res = routes.Where(route => route.Category.IndexOf(search, StringComparison.OrdinalIgnoreCase) >= 0).ToList();
                routes = res;
            }
            return routes;
        }

        /// <summary>
        /// This method filter routes by city
        /// </summary>
        /// <param name="city"></param>
        /// <returns></returns>
        public IEnumerable<Route> GetAllRoutes(string category, string city, string user = null)
        {
            var routes = GetAll();
            category = category ?? "";
            city = city ?? "";
            user = user ?? "";
            List<Route> result = new List<Route>();
            if(user != ""){
                result = routes.Where( route => route.Owner == user && route.Category.Contains(category, StringComparison.OrdinalIgnoreCase) 
                && route.City.Contains(city, StringComparison.OrdinalIgnoreCase) ).ToList();
            }else{
                result = routes.Where(route => route.Category.Contains(category, StringComparison.OrdinalIgnoreCase) && route.City.Contains(city, StringComparison.OrdinalIgnoreCase)).ToList();
            }            
            return result;
        }

        /// <summary>
        /// This method filter checkpoints by owner
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        public IEnumerable<Route> GetOf(string username)
        {
            var routes = GetAll();
                var res = routes.Where(route => route.Owner == username).ToList();
                routes = res;
            return routes;
        }

        /// <summary>
        /// This method looking for a route by id.
        /// </summary>
        /// <param name="id">route id</param>
        /// <returns>route required</returns>
        public Route GetOne(int id)
        {
            Route route = CyclepathDbContext.Routes.Where(r => r.Id == id).First();
            var checkpoints = CyclepathDbContext.Checkpoints.Where(checkpoint => checkpoint.RouteId == route.Id).ToList();
            route.Checkpoints = checkpoints;
            if (route != null)
            {
                return route;
            }
            else
            {
                throw new Exception($"Cannot find The Route With Id {id}");
            }
        }
    }
}
