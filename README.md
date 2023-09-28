# ⚔️ VENTION QUEST ⚔️
**Author:** Vincent Audette  
**Date:** September 28th, 2023

---

**GOAL**

- Complete the Quests listed below.
- Provide access to your code, e.g. link to a GitHub repo.
- Aim for performance and code efficiency


<details>
  <summary>🔎 Click to Expand/Collapse Additional Details 🔍</summary>

**TERMINOLOGIES**

- A composition is a mapping between materials.
- A material can be composed of other multiple materials, each with a specified quantity.
- A composition is a top down tree without repeated materials.
- A weapon is composed of **multiple materials**. It has a **name**, **power_level**, and **qty**.
- A material has a **base_power**, which influences the **power_level** of any weapon that uses it.
  > For example, an "Axe" weapon is composed of materials with ID 9 and 12, has a power level of:
  >
  > > ID 9 ➡️ 90 + 5*(130 + 10*220) = **11,740**
  > > > 90 = the Base Power of material ID(9)
  > > >
  > > > 5 = the quantity required to make 1 unit of material ID(9) from ID(10)
  > > >
  > > > 130 = the Base Power of material ID(10)
  > > >
  > > > 10 = the quantity required to make 1 unit of material ID(10) from ID(11)
  > > >
  > > > 220 = the Base Power of material ID(11)
  > >
  > > ID 12 ➡️ **300**
  > > > 300 = the Base Power of material ID (12)
  > >
  > > Total would be **12040**

Reference diagram from the seed data:
<br />

<img width="1004" alt="materials" src="https://user-images.githubusercontent.com/13532850/235346434-2f318669-ff0b-4b34-8156-5942eafa097b.png">

<br />
<br />

**QUESTS**:

1. Design and create a **Weapon** object in the database and a model class. Create the following seed weapons\*:

   > **Excalibur** composed of the following list of materials: ID(1), ID(6), ID(9)
   >
   > **Magic Staff** composed of the following material: ID(6)

   \*_Seed files for materials & compositions are already created._

2. Implement method on the Weapon class to compute total power level of a weapon based on its composition(s).

3. API endpoint to update material power level and making sure the weapon(s) that uses it is also updated.

4. Update method for **Material** class.
   _The "**find**" method is already created_
   > Another note: Update of an material should follow quest #3's logic as well
5. API endpoint to fetch the maximum quantity of a single **Weapon** that we can build.
   > Example. **Axe** can be built:
   >
   > ID 9 ➡️ 25 + ((100 + (110/10) ) / 5) = 47
   >
   > ID 12 ➡️ 120
   >
   > Max number of builds = 47

</details>


<br>

---

# Starting the Application

## Prerequisites
Ensure you have Node.js version v18.16.1 installed on your machine.

## Install Dependencies
Navigate to the root of the project and run the following command to install the necessary dependencies:
```bash
npm i
```

### Environment Variables
You must create a `.env` file at the root of the project to set up application-specific configurations. Here's a sample of the environment variables you might need:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_TEST_PORT=5433
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DATABASE=vention_quest_db
POSTGRES_TEST_DATABASE=vention_quest_test_db
```

⚠️ Ensure that the ports and database names for development and testing environments are distinct.

## Docker Setup
Ensure Docker is installed on your machine. Then, navigate to the directory containing `docker-compose.yml`.

To build and initiate Docker services, execute:
```bash
docker-compose up --build
```

<details>
  <summary>If you need to reset Docker and start from scratch, click here for the steps.</summary>

1. **Stop running containers**:
   ```bash
   docker-compose down
   ```

2. **Remove all containers**:
   ```bash
   docker rm -f $(docker ps -a -q)
   ```

3. **Remove all volumes**:
   ```bash
   docker volume rm $(docker volume ls -q)
   ```

4. **Remove the docker-compose created network**:
   ```bash
   docker network rm postgres_network
   ```

5. **Remove all images**:
   ```bash
   docker rmi -f $(docker images -q)
   ```

</details>

## Database Migration and Seeding

### Development
Migrate and seed the development database:
```bash
npm run dev:setup
```

### Test
Migrate and seed the test database:
```bash
npm run test:setup
```

## Running the Application

Before starting, ensure Docker, migrations, and seeds are set up.

To launch the application:
```bash
npm run start
```

The server will be accessible at [http://localhost:5001/](http://localhost:5001/).

### API Endpoints
Here's a concise list of available API endpoints:

1. **Material Endpoints**:
    - Fetch a material by ID: **GET** - `/api/material/:id`
    - Update the power of a material: **PUT** - `/api/material/:id/power` with sample body:
      ```json
      {
          "base_power": 80
      }
      ```

2. **Weapon Endpoints**:
    - Maximum buildable quantity for a weapon: **GET** - `/api/weapon/:id/max-buildable`
    - Fetch a weapon by ID: **GET** - `/api/weapon/:id`
    - Create a weapon: **POST** - `/api/weapon` with sample body:
      ```json
      {
          "name": "Axe",
          "material_ids": [9,12],
          "qty": 1
      }
      ```
    - Delete a weapon by ID: **DELETE** - `/api/weapon/:id`
    - Update a weapon: **PUT** - `/api/weapon/:id`
    - List all weapons: **GET** - `/api/weapon/all`

3. **General Endpoints**:
    - Home: **GET** - `/` - Returns "Vention Quest"

Use [http://localhost:5001](http://localhost:5001) as the base URL for the above endpoints.

### Running Tests

Ensure Docker, migrations, and seeds are set up before running tests.

Execute the following command to run tests:
```bash
npm run test
```