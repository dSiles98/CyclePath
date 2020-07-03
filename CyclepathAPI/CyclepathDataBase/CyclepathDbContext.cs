using CyclepathAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.CyclepathDataBase
{
    public class CyclepathDbContext: DbContext
    {
        /// <summary>
        /// DataBase initilizador
        /// </summary>
        /// <param name="options"></param>
        public CyclepathDbContext(DbContextOptions<CyclepathDbContext> options) : base(options)
        {

        } 

        public CyclepathDbContext()
        {

        }

        /// <summary>
        /// Account table
        /// </summary>
        public virtual DbSet<Account> Accounts { get; set; }
        public virtual DbSet<FriendList> Friends { get; set; }
        public virtual DbSet<RentPoint> RentPoints { get; set; }
        public virtual DbSet<Route> Routes { get; set; }
        public virtual DbSet<Checkpoint> Checkpoints { get; set; }
        public virtual DbSet<Bike> Bikes { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<BlockList> Blocks { get; set; }
        public virtual DbSet<Enlistment> Enlistments { get; set; }
        public virtual DbSet<Themes> Themes { get; set; }
        public virtual DbSet<Language> Languages { get; set; }

        /// <summary>
        /// DataBase configuration
        /// </summary>
        /// <param name="optionsBuilder"></param>
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>()
                        .HasIndex(account => account.Email)
                        .IsUnique(true);
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Account>()
                        .HasIndex(account => account.Username)
                        .IsUnique(true);
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Account>()
                        .HasOne(p => p.ThemeUserId)
                        .WithMany(b => b.Accounts)
                        .HasForeignKey(p => p.ThemeId)
                        .HasConstraintName("ForeignKey_Theme_User_Id");

            modelBuilder.Entity<Account>()
                        .HasOne(p => p.LanguageUserId)
                        .WithMany(b => b.Accounts)
                        .HasForeignKey(p => p.LanguageId)
                        .HasConstraintName("ForeignKey_Language_User_Id");
        }
    }
}
