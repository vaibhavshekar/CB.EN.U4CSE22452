### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Question1
```

2. Install dependencies
```bash
npm install
```

3. Start the application
```bash
npm start
```

The server will start running on http://localhost:3000

## API Endpoints Outputs

### GET /stocks
``` bash
{
	"Advanced Micro Devices, Inc.": "AMD",
	"Alphabet Inc. Class A": "GOOGL",
	"Alphabet Inc. Class C": "GOOG",
	"Amazon.com, Inc.": "AMZN",
	"Amgen Inc.": "AMGN",
	"Apple Inc.": "AAPL",
	"Berkshire Hathaway Inc.": "BRKB",
	"Booking Holdings Inc.": "BKNG",
	"Broadcom Inc.": "AVGO",
	"CSX Corporation": "CSX",
	"Eli Lilly and Company": "LLY",
	"Marriott International, Inc.": "MAR",
	"Marvell Technology, Inc.": "MRVL",
	"Meta Platforms, Inc.": "META",
	"Microsoft Corporation": "MSFT",
	"Nvidia Corporation": "NVDA",
	"PayPal Holdings, Inc.": "PYPL",
	"TSMC": "2330TW",
	"Tesla, Inc.": "TSLA",
	"Visa Inc.": "V"
}
```

### GET /stocks/NVDA
``` bash
{
	"averageStockPrice": 375.96024,
	"priceHistory": [
		{
			"price": 375.96024,
			"lastUpdatedAt": "2025-05-12T13:41:24.818484622Z"
		}
	]
}
```

### GET stocks/NVDA?minutes=50
``` bash
{
	"averageStockPrice": 420.6745733333334,
	"priceHistory": [
		{
			"price": 453.93552,
			"lastUpdatedAt": "2025-05-12T13:01:46.817618944Z"
		},
		{
			"price": 432.12796,
			"lastUpdatedAt": "2025-05-12T13:15:26.818490142Z"
		},
		{
			"price": 375.96024,
			"lastUpdatedAt": "2025-05-12T13:41:24.818484622Z"
		}
	]
}
```

### GET stockcorrelation?ticker=NVDA&ticker=AAPL
``` bash
{
	"correlation": 0,
	"stocks": {
		"NVDA": {
			"averagePrice": 375.96024,
			"priceHistory": [
				{
					"price": 375.96024,
					"lastUpdatedAt": "2025-05-12T13:41:24.818484622Z"
				}
			]
		},
		"AAPL": {
			"averagePrice": 658.4725,
			"priceHistory": [
				{
					"price": 658.4725,
					"lastUpdatedAt": "2025-05-12T13:33:53.818104432Z"
				}
			]
		}
	}
}
```

### the screenshots of the Insomnia Outputs can be found at https://docs.google.com/document/d/153LB23LhirL16Sdw9t40YV2VHkcjHdgyEKATYgkJEhw/edit?usp=sharing


