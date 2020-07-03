using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Models
{
    public class Account
    {
        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Lastname { get; set; }
        [Required]
        public string Birthday { get; set; }
        [Required]
        public string Email { get; set; }
        public bool EmailVerified { get; set; }
        public int ThemeId { get; set; } = 1;
        public int LanguageId { get; set; } = 1;

        [JsonIgnore]
        public Themes ThemeUserId { get; set; }

        [JsonIgnore]
        public Language LanguageUserId { get; set; }
        public List<RentPoint> RentPoints { get; set; }
    }
}
