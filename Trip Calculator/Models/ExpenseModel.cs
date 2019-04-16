using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TripCalculator.Models
{
	public class ExpenseModel
	{
		public int Id { get; set; }
		public int PersonId { get; set; }
		public string Description { get; set; }
		public float Amount { get; set; }
	}
}
