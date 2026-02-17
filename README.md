# Gacha Character Generator

A multi-step gacha system for rolling characters and artwork drops with customizable odds and banners.

## 🎮 How It Works

The gacha generator follows a 4-step process:

### 1. **Choose Banner** (`index.html`)
- Banners are grouped into **Upcoming**, **Active**, and **Past** sections.
- Upcoming banners show a **COMING <date>** badge (if `date` is set).
- Only **Active** banners are clickable.

### 2. **Select Character** (`character.html`)
- Choose a character pool (Wuxia, Ael Academy, or The Keys)
- Optionally enable **Gold Star Boost** for a specific character
  - Specify a character name and boost percentage
  - Adds that percentage directly to the character's base probability
  - Example: 10% base + 25% boost = 35% chance to get that character
- Optionally enable **"I Didn't Want to Pity"** (affects rarity odds)

### 3. **Character Result + Token Select** (`results.html`)
- The character is rolled and displayed immediately.
- You then choose a token to determine rarity odds.

### 4. **Drop Result** (`drop-results.html`)
- **Crit Fail** check happens first (2% chance).
- If not a crit fail, rarity is rolled using the token odds (and pity if enabled).
- Animation + rarity label display with the final drop.

## 📊 Drop Rarities Explained

- **Special** ✨: Special written piece (AU fanfic or canon backstory/side story)
- **Legendary** 🌟: Fully rendered piece (may include background depending on banner)
- **Rare** 💎: Clean sketch (finished line art with shading, sometimes includes color)
- **Common** ⭐: Sketch (whatever doodle mood of the day)

## 📁 File Structure

```
├── index.html           # Banner selection page
├── character.html       # Character pool & gold star selection
├── results.html         # Character result + token selection
├── drop-results.html    # Final roll & results display
├── banners.json         # Banner configurations & drops
├── coins.json           # Token types & rarity odds
├── characters.json      # Character pools (wuxia, academy, keys)
├── banner_art/          # Banner images
├── tokens/              # Token images
└── animations/          # Roll animations by token + rarity
```

## 🔧 JSON Configuration

### `banners.json`
```json
{
  "banners": [
    {
      "name": "cutesy",
      "status": "active",
      "img": "banner_art/bannercutesy.png",
      "drops": [
        {
          "item": "single chibi",
          "chance": 0.5
        }
      ]
    }
  ]
}
```

### `coins.json`
```json
{
  "coins": [
    {
      "name": "diamond",
      "displayName": "Diamond Token",
      "img": "tokens/diamond.png",
      "rarityOdds": {
        "special": 0.10,
        "legendary": 0.30,
        "rare": 0.40,
        "common": 0.20
      }
    }
  ]
}
```

### `characters.json`
```json
{
  "wuxia": ["Character 1", "Character 2"],
  "academy": ["Character 3", "Character 4"],
  "keys": ["Character 5", "Character 6"]
}
```

## 🎲 Probability Math

### Character Roll with Gold Star
When gold star is enabled:
1. Calculate base probability: `1 / pool_size`
2. Add boost: `boosted_prob = base_prob + (boost_percentage / 100)`
3. Remaining probability: `remaining = 1 - boosted_prob`
4. Other characters: `other_prob = remaining / (pool_size - 1)`

Example with 10 characters and 25% boost:
- Gold star character: 10% + 25% = **35% chance**
- Other 9 characters: 65% / 9 = **7.22% each**

### Crit Fail
- **2% chance** to trigger a crit fail before any rarity roll.

### Token Rarity Roll
1. **Rarity Roll**: Uses coin's `rarityOdds` to determine rarity level

## 🚀 Running Locally

Since the project uses `fetch()` to load JSON files, you need a local web server:

### Option 1: Python
```bash
cd "r:\source\OC Creator\gacha-generator"
python -m http.server 8000
```
Visit: `http://localhost:8000`

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 🎨 Customization

- **Add new banners**: Edit `banners.json` and add new banner objects
- **Add new coins**: Edit `coins.json` to create new token types
- **Add characters**: Edit `characters.json` to add characters to pools
- **Modify odds**: Adjust `chance` values in banners or `rarityOdds` in coins
- **Change styling**: Edit the `<style>` sections in each HTML file

## 📝 Notes

- All probabilities should sum to 1.0 within each system
- The `chance` values in banner drops are relative weights (don't need to sum to 1)
- Banner images should be placed in `banner_art/` folder
- Token images should be placed in `tokens/` folder
- Set `"status": "upcoming"` or `"status": "past"` to control banner placement
- Upcoming banners can include a `date` field (e.g., `"2/16"`) for sorting and display

## 🐛 Troubleshooting

**Characters not loading**: Make sure `characters.json` is in the same directory as the HTML files

**Banners not displaying**: Check that banner image paths in `banners.json` are correct

**CORS errors**: Use a local web server (see "Running Locally" section)
