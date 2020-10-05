// reports/gold-ldp-basic.txt:Total tests run: 90, Failures: 20, Skips: 69
// reports/gold-websockets-pubsub.txt:Tests:       1 failed, 1 total
// reports/gold.txt:Total tests run: 90, Failures: 20, Skips: 69
// reports/inrupt-pod-server-ldp-basic.txt:Total tests run: 90, Failures: 16, Skips: 49
// reports/inrupt-pod-server-websockets-pubsub.txt:Tests:       1 passed, 1 total
// reports/inrupt-pod-server.txt:Total tests run: 90, Failures: 16, Skips: 49
// reports/node-solid-server-ldp-basic.txt:Total tests run: 90, Failures: 28, Skips: 47
// reports/node-solid-server-websockets-pubsub.txt:Tests:       1 failed, 1 total
// reports/node-solid-server.txt:Total tests run: 90, Failures: 28, Skips: 47
// reports/trellis-ldp-basic.txt:Total tests run: 90, Failures: 9, Skips: 29
// reports/trellis-websockets-pubsub.txt:Tests:       1 failed, 1 total
// reports/trellis.txt:Total tests run: 90, Failures: 9, Skips: 29

const PAD_LEN = 20
const table = {};

function processPerlBasedLine (parts) {
  const serverNameRegex = new RegExp('reports/(.+?)-rdf-fixtures.txt')
  const serverName = serverNameRegex.exec(parts[0])[1]
  if (!table[serverName]) { // The next few if sentences look bizarre, I don't know how to do without them
    table[serverName] = {}
  }
  if (!table[serverName]['perlBased']) {
    table[serverName]['perlBased'] = {}
  }
  if (!table[serverName]['perlBased']['totalNumber']) {
    table[serverName]['perlBased']['totalNumber'] = 0
  }
  if (!table[serverName]['perlBased']['passedNumber']) {
    table[serverName]['perlBased']['passedNumber'] = 0
  }
  if (parts.indexOf('earl:failed') !== -1) {
      table[serverName].perlBased.totalNumber++
  } else if (parts.indexOf('earl:passed') !== -1) {
      table[serverName].perlBased.passedNumber++
      table[serverName].perlBased.totalNumber++
  } else if (parts.indexOf('earl:untested') !== -1) {
      table[serverName].perlBased.totalNumber++
  }
}

function processWebsocketsPubsubLine (parts) {
  // console.log('process websockets-pubsub line', parts)
  // reports/gold-websockets-pubsub.txt:Tests:       1 failed, 1 total
  // [ 'reports/gold-websockets-pubsub.txt:Tests:', '', '',
  //   '', '', '',
  //   '', '1', 'failed,', '1', 'total' ]
  let result;
  if (parts[8] === 'failed,') {
    result = '0/1';
  } else if (parts[8] === 'passed,') {
    result = '1/1';
  }
  const serverName = parts[0].substring('reports/'.length, parts[0].length - '-websockets-pubsub.txt:Tests:'.length)
  // console.log(parts[0], 'reports/'.length, parts[0].length, '-websockets-pubsub.txt:Tests:'.length, serverName)
  if (!table[serverName]) {
    table[serverName] = {};
  }
  table[serverName].websocketsPubsub = result;
}
function processLdpBasicLine (parts) {
  //  console.log('process ldp-basic line', parts)
  // reports/gold-ldp-basic.txt:Total tests run: 90, Failures: 20, Skips: 69
  // [ 'reports/gold-ldp-basic.txt:Total', 'tests', 'run:',
  //   '90,', 'Failures:', '20,',
  //   'Skips:', '69' ]
  const total = parseInt(parts[3])
  const failures = parseInt(parts[5])
  const skips = parseInt(parts[7])
  const result = `${total - failures - skips}/${total}`
  // console.log(parts[3], total, parts[5], failures, parts[7], skips, result)
  const serverName = parts[0].substring('reports/'.length, parts[0].length - '-ldp-basic.txt:Total'.length)
  // console.log(parts[0], 'reports/'.length, parts[0].length, '-ldp-basic.txt:Total'.length, serverName)
  if (!table[serverName]) {
    table[serverName] = {};
  }
  table[serverName].ldpBasic = result;
}

<<<<<<< HEAD
function processJestBasedLine(parts, testName) {
  // console.log('processing', parts);
  const serverName = (new RegExp(`^reports.(.*)-${testName}.txt.Tests.$`, 'gm')).exec(parts[0])[1];
=======
function processWebidProviderLine(parts) {
  // console.log('processing', parts);
  const serverName = (/^reports.(.*)-webid-provider.txt.Tests.$/gm).exec(parts[0])[1];
>>>>>>> origin/master
  const data = {};
  for (let i=1; i<parts.length; i++) {
    ['skipped', 'passed', 'failed', 'total'].forEach(term => {
      if (parts[i] === term || parts[i] === `${term},`) {
        data[term] = parseInt(parts[i-1]);
      }
    });
  }
  if (!table[serverName]) {
    table[serverName] = {}
  }
  // console.log(serverName, data);
<<<<<<< HEAD
  table[serverName][testName] = `${data.passed || 0}/${data.total - (data.skipped || 0)}`
=======
  table[serverName].webidProvider = `${data.passed || 0}/${data.total - data.skipped}`
>>>>>>> origin/master
}
function processLine (line) {
  const parts = line.split(' ');
  if (line.indexOf('ldp-basic') !== -1) {
    if (parts.length < 8) {
      return;
    }
    processLdpBasicLine(parts)
  } else if (line.indexOf('rdf-fixtures') !== -1) {
    processPerlBasedLine(parts)
  } else if (line.indexOf('webid-provider') !== -1) {
    processJestBasedLine(parts, 'webid-provider');
  } else if (line.indexOf('solid-crud') !== -1) {
    processJestBasedLine(parts, 'solid-crud');
  } else if (line.indexOf('web-access-control') !== -1) {
    processJestBasedLine(parts, 'web-access-control');
  } else {
    if (parts.length < 8) {
      // console.log('too few parts!', parts)
      return;
    }
    processWebsocketsPubsubLine(parts)
  }
}

function writeOutput() {
  console.log(['Server', 'WebID Provider', 'Solid Crud', 'Web Access Control', /* 'RDF Fixtures' */].map(str => str.padEnd(PAD_LEN)).join('\t'))
  for (let serverName in table) {
    // console.log(table[serverName], serverName)
    let perlBasedResult = '-';
    if (table[serverName].perlBased) {
      perlBasedResult = `${table[serverName].perlBased.passedNumber}/${table[serverName].perlBased.totalNumber}`
    }
    console.log([
      serverName || '---',
      table[serverName]['webid-provider'] || '---',
      table[serverName]['solid-crud'] || '---',
      table[serverName]['web-access-control'] || '---',
      // perlBasedResult || '---'
    ].map(str => str.padEnd(PAD_LEN)).join('\t'))
  }
}


// ...
process.stdin.resume();
process.stdin.setEncoding('utf8');

var lingeringLine = "";

process.stdin.on('data', function(chunk) {
    lines = chunk.split("\n");

    lines[0] = lingeringLine + lines[0];
    lingeringLine = lines.pop();

    lines.forEach(processLine);
});

process.stdin.on('end', function() {
  processLine(lingeringLine);
//  console.log(table)
  writeOutput()
});
