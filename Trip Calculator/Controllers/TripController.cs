using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TripCalculator.Models;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TripCalculator.Controllers
{
	public class TripController : Controller
	{
		private static readonly TripModel _trip;
		
		static TripController()
		{
			_trip = new TripModel
			{
				PersonPayments = new List<PersonModel>
				{
					new PersonModel
					{
						Id = 0,
						Name = "Jonathan",
						Payments = new List<ExpenseModel>
						{
							new ExpenseModel
							{
								Id = 0,
								PersonId = 0,
								Amount = 5.75f,
								Description = "Snacks"
							}
						}
					},
					new PersonModel
					{
						Id = 1,
						Name = "David",
						Payments = new List<ExpenseModel>
						{
							new ExpenseModel
							{
								Id = 0,
								PersonId = 1,
								Amount = 12.0f,
								Description = "Gas"
							}
						}
					}
				}
			};
			var tripAverage = _trip.Total / _trip.PersonPayments.Count;
			var peoplePay = new List<PersonModel>();
			var peopleReceive = new List<PersonModel>();
			foreach (var person in _trip.PersonPayments)
			{
				var diff = tripAverage - person.Total;

				if (diff >= 0)
				{
					peoplePay.Add(new PersonModel { Id = person.Id, Name = person.Name, Owe = diff });
				}
				else
				{
					peopleReceive.Add(new PersonModel { Id = person.Id, Name = person.Name, Due = diff*-1 });
				}
			}
			foreach (var personPaying in peoplePay)
			{
				foreach (var personReceiving in peopleReceive)
				{
					if (personReceiving.Due == 0) continue;

					if (personPaying.Owe >= personReceiving.Due)
					{
						var payment = new ExpenseModel
						{
							Description = personReceiving.Name,
							Amount = personReceiving.Due
						};
						personPaying.Payments.Add(payment);
						personPaying.Owe -= personReceiving.Due;
						personReceiving.Due = 0;
					}
					else
					{
						var payment = new ExpenseModel
						{
							Description = personReceiving.Name,
							Amount = personPaying.Owe
						};
						personPaying.Payments.Add(payment);
						personReceiving.Due -= personPaying.Owe;
						personPaying.Owe = 0;
						break;
					}
				}
			}
			_trip.Settlements = peoplePay;
		}

		public void RecalculatePersonIds()
		{
			var id = 0;
			foreach(var person in _trip.PersonPayments)
			{
				person.Id = id;
				foreach (var expense in person.Payments)
				{
					expense.PersonId = id;
				}
				id += 1;
			}
		}

		public void RecalculatePaymentIds(int personId)
		{
			var id = 0;
			foreach (var expense in _trip.PersonPayments[personId].Payments)
			{
				expense.Id = id;
				id += 1;
			}
		}

		public void CalculateSettlements()
		{
			var tripAverage = _trip.Total / _trip.PersonPayments.Count;
			var peoplePay = new List<PersonModel>();
			var peopleReceive = new List<PersonModel>();
			foreach (var person in _trip.PersonPayments)
			{
				var diff = tripAverage - person.Total;

				if (diff >= 0)
				{
					peoplePay.Add(new PersonModel { Name = person.Name, Owe = diff });
				}
				else
				{
					peopleReceive.Add(new PersonModel { Name = person.Name, Due = diff * -1 });
				}
			}
			foreach (var personPaying in peoplePay)
			{
				foreach (var personReceiving in peopleReceive)
				{
					if (personReceiving.Due == 0) continue;

					if (personPaying.Owe >= personReceiving.Due)
					{
						var payment = new ExpenseModel
						{
							Description = personReceiving.Name,
							Amount = personReceiving.Due
						};
						personPaying.Payments.Add(payment);
						personPaying.Owe -= personReceiving.Due;
						personReceiving.Due = 0;
					}
					else
					{
						var payment = new ExpenseModel
						{
							Description = personReceiving.Name,
							Amount = personPaying.Owe
						};
						personPaying.Payments.Add(payment);
						personReceiving.Due -= personPaying.Owe;
						personPaying.Owe = 0;
						break;
					}
				}
			}
			_trip.Settlements = peoplePay;
		}

		[Route("person/add")]
		[HttpPost]
		public ActionResult AddPerson(PersonModel newPerson)
		{
			_trip.PersonPayments.Add(newPerson);
			CalculateSettlements();
			return Content("Success");
		}

		[Route("expense/add")]
		[HttpPost]
		public ActionResult AddExpense(ExpenseModel newExpense)
		{
			_trip.PersonPayments[newExpense.PersonId].Payments.Add(newExpense);
			CalculateSettlements();
			return Content("Success");
		}

		[Route("person/remove")]
		[HttpDelete]
		public ActionResult RemovePerson(PersonModel person)
		{
			_trip.PersonPayments.RemoveAt(person.Id);
			RecalculatePersonIds();
			CalculateSettlements();
			return Content("Success");
		}

		[Route("expense/remove")]
		[HttpDelete]
		public ActionResult RemoveExpense(ExpenseModel expense)
		{
			_trip.PersonPayments[expense.PersonId].Payments.RemoveAt(expense.Id);
			RecalculatePaymentIds(expense.PersonId);
			CalculateSettlements();
			return Content("Success");
		}

		[Route("trip")]
		[ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
		public ActionResult Trip()
		{
			return Json(_trip);
		}

		// GET: /<controller>/
		public IActionResult Index()
		{
			return View();
		}
	}
}
