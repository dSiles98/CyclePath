using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Models
{
    public class Checkpoint
    {
        [Key]
        public int Id { get; set; }
        public double Latitude { get; set; }
        public double Length { get; set; }
        public int RouteId { get; set; }
        [ForeignKey("RouteId")]
        [NotMapped]
        [JsonIgnore]
        public virtual Route Route { get; set; }
    }
}
