using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CyclepathAPI.Models
{
    /// <summary>
    /// bike model for database
    /// </summary>
    public class Bike
    {
        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public bool Disponible { get; set; }
        public string Image { get; set; }
        public int RentPointId { get; set; }
        [ForeignKey("RentPointId")]
        [JsonIgnore]
        public RentPoint RentPoint { get; set; }
    }
}
