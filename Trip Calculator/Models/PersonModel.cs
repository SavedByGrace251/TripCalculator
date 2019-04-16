using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TripCalculator.Models
{
	public class PersonModel
	{
		public int Id { get; set; }
		public string Name { get; set; }
		public List<ExpenseModel> Payments { get; set; } = new List<ExpenseModel>();
		public float Total {
			get {
				var total = 0f;
				foreach (var expense in Payments)
				{
					total += expense.Amount;
				}
				return total;
			}
		}
		public float Owe { get; set; } = 0f;
		public float Due { get; set; } = 0f;
	}
}
