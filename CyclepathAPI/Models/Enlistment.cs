using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace CyclepathAPI.Models
{
    public class Enlistment
    {
        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int IdAccount { get; set; }
        public int IdEvent { get; set; }

        [ForeignKey("IdAccount")]
        [NotMapped]
        [JsonIgnore]
        public Account Owner { get; set; }

        [ForeignKey("IdEvent")]
        [NotMapped]
        [JsonIgnore]
        public Event ev { get; set; }
    }
}
