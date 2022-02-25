using PreEnrollmentMgmt.Application.Repositories;
using PreEnrollmentMgmt.Core.Repositories;
using PreEnrollmentMgmt.Core.Services;
using PreEnrollmentMgmt.DataAccess;
using PreEnrollmentMgmt.WebApi.Controllers.DTOS;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<PremaRumDbContext>();
builder.Services.AddScoped<IPreEnrollmentRepository, PreEnrollmentRepository>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<ISemesterOfferRepository, SemesterOfferRepository>();
builder.Services.AddScoped<ITransactionManager, TransactionManager>();
builder.Services.AddScoped<PreEnrollmentService, PreEnrollmentService>();
builder.Services.AddScoped<StudentValidationService, StudentValidationService>();
builder.Services.AddAutoMapper(typeof(DTOMapping));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();