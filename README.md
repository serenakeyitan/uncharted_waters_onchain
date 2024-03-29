It is a proof of concept of Infinite Seas!

# Uncharted Waters Onchain

![image](https://hackmd.io/_uploads/ByF2u2iKa.png)

by serena tan

### Game Type: 

* MMORPG x Idle

### Game Type: 

* The theme is "time"

### Design Principle: 

1. **Time Mastery**
   * Time-based resource regeneration and skill progression
   * Automated tasks and idle mechanics influenced by real-time progression
2. **Enhancing Composability**
   - Mods Marketplace
   - Layer Composability
3. **Building Alliances in Social Gaming**
   - Maximizing the ability to form alliances
     - Having a tab displaying existing alliances
4. **Item Development: Stats, Values, and Levels**
   - The higher the skill level, the lower the energy cost will be
5. **Risk and Return Equalization**
   - The energy bar is refilled every 24 hours; all actions cost energy
   - commit-and-reveal function ensure that 
   - Stake `ingame token` to claim ownership of an island. Unstake `ingame token` to stop playing the game.
   - The heavier the cargo you carry, the slower your movement speed will be



---

## Game Loop

* Players need to stake coins (`ingame token`) to gain ownership of an island
  ![image](https://hackmd.io/_uploads/S1CTd2iK6.png)
  ![image](https://hackmd.io/_uploads/BJvR_2jKT.png)



* Players engage in time-sensitive resource gathering, where each resource follows its own temporal cycle for regeneration.
* Once they have equipped and crafted a ship, they can sail to other islands to engage in diplomatic activities (trade, combat, theft).
* Crafting and exploring in the game are closely tied to time. When players build ships for travel and trading, the trips these ships take are based on how long and how far they have to go. 
* They also need to protect themselves from attacks. Once the hitpoints reach zero, they can respawn as long as the island's hitpoints are positive, but they will be frozen for a day.
* They need to build a defense system to protect their land and avoid attacks or theft by other players. If the island's hitpoints fall to zero, their initial stake and loot can be claimed by others.
* Defensive strategies and island fortifications are tested by time-triggered events, such as tidal changes or seasonal cycles,
* By establishing marketplaces, they can exchange resources with others to earn profits.
* Playing the game needs to make strategic move; every move costs time and energy; energy bar will be refilled every 24 hrs. 

---

## Game Specification: Map and Resources Setup

## Overview

The game world consists of an infinite grid, where each cell represents a hexagonal tile. The map is primarily composed of water tiles, with a few islands scattered throughout. Each island is rich in resources that players can collect and use for various in-game activities. 

## Map Generation

### Grid

- The map is infinitely big. 
- Each cell in the grid is a hexagonal tile.

### Water

- The default tile is a water tile, represented by the color blue.

### Islands

- The map contains 15 islands in every 100 x 100 grids 
- Each initial island is generated using a random walk algorithm, ensuring that all tiles in an island are interconnected.
- The minimum distance between any two island centers is 8 tiles.
- Each island has exactly 19 tiles.
- islands are expandable, tho each additional grid will resulting in more stakes. 

## Resources

### Types of Resources

1. **Base Resources**

   * Wood

   - Stone
   - Cotton

2. **Advanced Resources**

   - Iron
   - Coal
   - Copper
   - Uranium

### Resource Distribution

#### Base Resources

- Each island contains 3 ``base resources``
- 4 of the 15 generated island contains additional 1 ``advanced resource``
- The distribution of base resources is randomized but follows these constraints:
  - ~~Each type of base resource must appear at least 2 times but no more than 3 times on each island.~~

#### Advanced Resources

- Four islands will contain advanced resources.
- ~~Each of these islands will contain exactly 2 tiles of the same advanced resource.~~


## Tile Representation

### Water Tile

- Represented by the color blue.
- Contains no resources.

### Resource Tile

- Represented by various colors depending on the resource it contains.

![image](https://hackmd.io/_uploads/BkbeFnjtp.png)


##

### Random Walk Algorithm

* Used to generate islands.
* Ensures that each island has exactly 19 tiles.
* Ensures that all tiles in an island are interconnected.
* If an island cannot be generated with the specified constraints, the algorithm will retry until it succeeds.

![image](https://hackmd.io/_uploads/HJ8fK3sFp.png)


---

## Game Specification: Player Action

- Each action causes `energy` - 1;
- All successful action causes the specific skill`xp` +  1; 
- After accumulating enough `xp`, the skill specific `level` + 1, which resulting less energy cost
- Energy needs time to recover
- Playing the game needs to make strategic move; every move costs time and energy
- Energy bar will be refilled every 24 hr

**``Mining``**: player can mine with a initial speed of 1 sec per resources, all the mined resources go to players ``inventory``. `Mining` skill `xp + 1`.~~inventory is a table with name, item color, and amount, can be show and collapse when click button. The inventory will update.~~

- ~~when player select the grid by single left click, add a effect on the grid. once they press "m" on keyboard, the resources start to mine~~!![image](https://hackmd.io/_uploads/Hy07Y3iKT.png)


**`Crafting/Smithing`**: players can craft items with existing receipts and suffcient resources in inventory, `crafting` skill `xp + 1`; 

**`Woodcutting`**: players can cut woods. Each action will make the `woodcutting` skill `xp + 1`

**`Fishing`**: players can go fishing. Each action will make the `fishing` skill `xp + 1`

**`Cooking`**: players can go fishing. Each action will make the `cooking `skill `xp + 1` cooked food are used to add `Hitpoints`

**`Thieving`**: player can steal things from other players. Successful thieving will make `thieving skill xp + 1`

**`Sailing`**: player can sail from one place to another with crafted ships. Sailing will make `sailing xp + 1`

**`Building(later)`**: players can place buildings on their islands; buildings have different kinds

- **`Military building`**: building will auto attack enemies, once the enemies enter a given range
- **`Production building`**: the factory will accelerating action process, but for each 1 minute it works, it need to burn 1 wood. 
- **`Storage building`**: store excessive equipments
- **`Marketplace(global or local?)`**: allow players to buy and sell; 24 hrs open



---

## Game Specification: Player Stats

- `Combat level`
- `Strength`
- `Defense`
- `Hitpoints`
- `Ranged`

cd to the folder

run `npm start`

You can now view uncharted in the browser.

  Local:            http://localhost:3000
