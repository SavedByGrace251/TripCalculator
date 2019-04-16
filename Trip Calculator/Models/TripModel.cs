using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TripCalculator.Models
{
	public class TripModel
	{
		public List<PersonModel> PersonPayments { get; set; }
		public float Total {
			get
			{
				var total = 0f;
				foreach (var person in PersonPayments)
				{
					total += person.Total;
				}
				return total;
			}
		}
		public List<PersonModel> Settlements { get; set; }
	}
}
