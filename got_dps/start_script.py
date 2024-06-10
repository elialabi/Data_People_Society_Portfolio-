import json
from collections import defaultdict, Counter

def parse_script(filename):
    # store character interactions and counts
    links = defaultdict(Counter)
    last_speaker = None

    # Load the data 
    with open(filename, 'r') as file:
        data = json.load(file)
        # Iterate through each episodes text entries
        for entry in data:
            # Parsing only from the first episode of the first season
            if entry['seasonNum'] == 1 and entry['episodeNum'] == 1:
                for line in entry['text']:
                    current_speaker = line['name']
                    if last_speaker and last_speaker != current_speaker:
                        links[last_speaker][current_speaker] += 1
                    last_speaker = current_speaker

    # Convert the defaultdict to a list of dictionaries for links
    nodes = [{'id': node} for node in set(links.keys()).union(*links.values())]
    edges = [{'source': src, 'target': tgt, 'value': count}
             for src, tgt_count in links.items()
             for tgt, count in tgt_count.items()]

    return {'nodes': nodes, 'links': edges}

def save_data(graph_data, output_filename):
    with open(output_filename, 'w') as file:
        json.dump(graph_data, file, indent=4)


graph_data = parse_script('script-bag-of-words.json')
save_data(graph_data, 'data.json')
