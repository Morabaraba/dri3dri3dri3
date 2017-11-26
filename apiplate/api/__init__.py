import csv

def get_voters_where(*args, **kwargs):
    county = kwargs.get('county')
    month = kwargs.get('month')
    affiliation = kwargs.get('affiliation')
    limit = kwargs.get('limit')
    
    result = []
    with open('data/rows.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            result.append(row)
        
    return result, 200
    