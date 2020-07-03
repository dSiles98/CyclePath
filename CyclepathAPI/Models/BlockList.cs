using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace CyclepathAPI.Models
{
    public class BlockList
    {
        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int IdOwner { get; set; }
        public int IdBlocked { get; set; }

        [ForeignKey("IdOwner")]
        [NotMapped]
        [JsonIgnore]
        public Account Owner { get; set; }

        [ForeignKey("IdBlocked")]
        [NotMapped]
        [JsonIgnore]
        public Account blocked { get; set; }
    }
}
