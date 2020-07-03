using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CyclepathAPI.Models
{
    public class RentPoint
    {
        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Title { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Direction { get; set; }
        public int Rating { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        [JsonIgnore]
        public List<Bike> Bikes { get; set; }
        [ForeignKey("OwnerId")]
        [JsonIgnore]
        public Account Owner { get; set; }
    }
}
