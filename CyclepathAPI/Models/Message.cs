using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace CyclepathAPI.Models
{
    public class Message
    {
        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public int Addressee { get; set; }
        public DateTime SendTime { get; set; }
        public string Content { get; set; }
        public bool delivered { get; set; }
    }
}
