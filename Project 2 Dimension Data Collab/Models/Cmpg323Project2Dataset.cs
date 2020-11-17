using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Test_Database.Models
{
    public partial class Cmpg323Project2Dataset
    {

        
        public string Age { get; set; }
        public string Attrition { get; set; }
        [Display(Name ="Business Travel")]
        public string BusinessTravel { get; set; }
        [Display(Name = "Daily Rate")]
        public string DailyRate { get; set; }
        public string Department { get; set; }
        [Display(Name = "Distance From Home")]
        public string DistanceFromHome { get; set; }
        public string Education { get; set; }
        [Display(Name = "Education Field")]
        public string EducationField { get; set; }
        [Display(Name = "Employee Count")]
        public string EmployeeCount { get; set; }
        [Display(Name = "Employee Number")]
        public string EmployeeNumber { get; set; }
        [Display(Name = "Environment Satisfaction")]
        public string EnvironmentSatisfaction { get; set; }
        public string Gender { get; set; }
        [Display(Name = "Hourly Rate")]
        public string HourlyRate { get; set; }
        [Display(Name = "Job Involvement")]
        public string JobInvolvement { get; set; }
        [Display(Name = "Job Level")]
        public string JobLevel { get; set; }
        [Display(Name = "Job Role")]
        public string JobRole { get; set; }
        [Display(Name = "Job Satisfaction")]
        public string JobSatisfaction { get; set; }
        [Display(Name = "Marital Status")]
        public string MaritalStatus { get; set; }
        [Display(Name = "Montly Income")]
        public string MonthlyIncome { get; set; }
        [Display(Name = "Monthly Rate")]
        public string MonthlyRate { get; set; }
        [Display(Name = "Num Companies Worked")]
        public string NumCompaniesWorked { get; set; }
        [Display(Name = "Over 18")]
        public string Over18 { get; set; }
        [Display(Name = "Overtime")]
        public string OverTime { get; set; }
        [Display(Name = "Percent Salary Hike")]
        public string PercentSalaryHike { get; set; }
        [Display(Name = "Performance Rating")]
        public string PerformanceRating { get; set; }
        [Display(Name = "Relationship Satisfaction")]
        public string RelationshipSatisfaction { get; set; }
        [Display(Name = "Standard Hours")]
        public string StandardHours { get; set; }
        [Display(Name = "Stock Option Level")]
        public string StockOptionLevel { get; set; }
        [Display(Name = "Total working years")]
        public string TotalWorkingYears { get; set; }
        [Display(Name = "Training Times Last Year")]
        public string TrainingTimesLastYear { get; set; }
        [Display(Name = "Work Life Balance")]
        public string WorkLifeBalance { get; set; }
        [Display(Name = "Year at company")]
        public string YearsAtCompany { get; set; }
        [Display(Name = "Years in current role")]
        public string YearsInCurrentRole { get; set; }
        [Display(Name = "Years since last promotion")]
        public string YearsSinceLastPromotion { get; set; }
        [Display(Name = "Years with current manager")]
        public string YearsWithCurrManager { get; set; }
    }
}
