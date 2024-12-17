f=open('111.txt').readlines()
f=[el.strip() for el in f]
res={}
nm= dict([(s[1],s[0]) for s in enumerate(f[0].split('	'))])
results=[]
for i in range(1,len(f)):
    items= f[i].split('	')
    res=  {
    'chapterid': items[nm['chapterid']],
    'id': items[nm['id']],
    'task': items[nm['task']],
    'defaultinput': items[nm['defaultinput']].split(','),
    'defaultcode': items[nm['defaultcode']],
    'inout': [
      { 'inv': items[nm['in1']].split(','), 'outv': items[nm['out1']].split(',') },
      { 'inv': items[nm['in2']].split(','), 'outv': items[nm['out2']].split(',') },
    ],
    'restrictions': { 'maxlines': items[nm['maxlines']], 'musthave': items[nm['musthave']].split(';')  },
  }
    results.append(res)
print('export const testsall ='+str(results))

