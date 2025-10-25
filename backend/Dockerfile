# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies first (caches better)
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and publish
COPY . ./
RUN dotnet publish -c Release -o out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/out ./

COPY project.db ./
# Set environment variable for ASP.NET Core to listen on Render port
ENV ASPNETCORE_URLS=http://+:${PORT}
EXPOSE ${PORT}

# Run the backend DLL
ENTRYPOINT ["dotnet", "backend.dll"]
