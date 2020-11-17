using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Test_Database.Data;
using Test_Database.Models;


namespace Test_Database.Controllers
{
    //[Authorize]
    public class Cmpg323Project2DatasetController : Controller
    {
        private readonly Project2Context _context;

        public Cmpg323Project2DatasetController(Project2Context context)
        {
            _context = context;
        }

        // GET: Cmpg323Project2Dataset

        [Route("data/index")]
        public async Task<IActionResult> Index()
        {
            return View(await _context.Cmpg323Project2Dataset.ToListAsync());
        }

        // GET: Cmpg323Project2Dataset/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cmpg323Project2Dataset = await _context.Cmpg323Project2Dataset
                .FirstOrDefaultAsync(m => m.EmployeeNumber == id);
            if (cmpg323Project2Dataset == null)
            {
                return NotFound();
            }

            return View(cmpg323Project2Dataset);
        }



        // GET: Cmpg323Project2Dataset/Create

        [Authorize(Roles ="admin, manager")]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Cmpg323Project2Dataset/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "admin, manager")]
        public async Task<IActionResult> Create([Bind("Age,Attrition,BusinessTravel,DailyRate,Department,DistanceFromHome,Education,EducationField,EmployeeCount,EmployeeNumber,EnvironmentSatisfaction,Gender,HourlyRate,JobInvolvement,JobLevel,JobRole,JobSatisfaction,MaritalStatus,MonthlyIncome,MonthlyRate,NumCompaniesWorked,Over18,OverTime,PercentSalaryHike,PerformanceRating,RelationshipSatisfaction,StandardHours,StockOptionLevel,TotalWorkingYears,TrainingTimesLastYear,WorkLifeBalance,YearsAtCompany,YearsInCurrentRole,YearsSinceLastPromotion,YearsWithCurrManager")] Cmpg323Project2Dataset cmpg323Project2Dataset)
        {
            if (ModelState.IsValid)
            {
                _context.Add(cmpg323Project2Dataset);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(cmpg323Project2Dataset);
        }

        // GET: Cmpg323Project2Dataset/Edit/5
        [Authorize(Roles = "admin, manager")]
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cmpg323Project2Dataset = await _context.Cmpg323Project2Dataset.FindAsync(id);
            if (cmpg323Project2Dataset == null)
            {
                return NotFound();
            }
            return View(cmpg323Project2Dataset);
        }

        // POST: Cmpg323Project2Dataset/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "admin, manager")]
        public async Task<IActionResult> Edit(string id, [Bind("Age,Attrition,BusinessTravel,DailyRate,Department,DistanceFromHome,Education,EducationField,EmployeeCount,EmployeeNumber,EnvironmentSatisfaction,Gender,HourlyRate,JobInvolvement,JobLevel,JobRole,JobSatisfaction,MaritalStatus,MonthlyIncome,MonthlyRate,NumCompaniesWorked,Over18,OverTime,PercentSalaryHike,PerformanceRating,RelationshipSatisfaction,StandardHours,StockOptionLevel,TotalWorkingYears,TrainingTimesLastYear,WorkLifeBalance,YearsAtCompany,YearsInCurrentRole,YearsSinceLastPromotion,YearsWithCurrManager")] Cmpg323Project2Dataset cmpg323Project2Dataset)
        {
            if (id != cmpg323Project2Dataset.EmployeeNumber)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(cmpg323Project2Dataset);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!Cmpg323Project2DatasetExists(cmpg323Project2Dataset.EmployeeNumber))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(cmpg323Project2Dataset);
        }

        // GET: Cmpg323Project2Dataset/Delete/5
        [Authorize(Roles = "admin, manager")]
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var cmpg323Project2Dataset = await _context.Cmpg323Project2Dataset
                .FirstOrDefaultAsync(m => m.EmployeeNumber == id);
            if (cmpg323Project2Dataset == null)
            {
                return NotFound();
            }

            return View(cmpg323Project2Dataset);
        }

        // POST: Cmpg323Project2Dataset/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var cmpg323Project2Dataset = await _context.Cmpg323Project2Dataset.FindAsync(id);
            _context.Cmpg323Project2Dataset.Remove(cmpg323Project2Dataset);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool Cmpg323Project2DatasetExists(string id)
        {
            return _context.Cmpg323Project2Dataset.Any(e => e.EmployeeNumber == id);
        }
    }
}
