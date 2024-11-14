# suno_scripts
Browser scripts for working with Suno. This allows you to perform authenticated actions against the Suno API from your browser.

## PreReqs

1. First you'll need to open up the dev console.
2. Paste in library.js
3. Run your choosen script.


## Searching Trash

1. You have follow prereqs
2. Type: `await searchTrash('<searchString>')
3. This will return matching rules and the page they are on within your trash.

**Example**

```javascript
await searchTrash('Sunshine')
0: 
{title: 'Sunshine Chemical Woman (RealAudio Codec from 1997 Mix) (Cover)', page: 238, id: 'fb8e15b5-88ed-4382-a6f6-dbfe5db6cb4e'}
1: 
{title: 'Sunshine Chemical Woman (RealAudio Codec from 1997 Mix) - Instrumental', page: 413, id: '515fd7dc-ab82-4ae3-83ba-b435797694ed'}
2: 
{title: 'Sunshine Chemical Woman (RealAudio Codec from 1997 Mix) - Vocals', page: 413, id: '8e3194ef-8304-4a05-9db8-dfceb5177
```

Now when you go to your trash page, enter the page provided to find your song.