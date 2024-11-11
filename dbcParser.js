module.exports = {
  parse: function (fileContent) {
    const messages = [];
    let currentMessage = null;

    const messageRegex = /^BO_\s+(\d+)\s+(\w+):\s+(\d+)\s+(\w+)/;
    const signalRegex = /^\s*SG_\s+(\w+)\s+:\s+(\d+)\|(\d+)@(\d+)([\+\-])\s?\(([\d\.]+),([\d\.]+)\)\s+\[([\d\.]+)\|([\d\.]+)\]\s+"(.*?)"\s+(\w+)/;

    function adjustStartBit(startBit, bitLength, byteOrder) {
      if (byteOrder === 0) { // Little-endian
        return Math.floor(startBit / 8) * 8 + (7 - (startBit % 8));
      } else { // Big-endian
        return startBit;
      }
    }

    const lines = fileContent.split('\n');

    lines.forEach((line, index) => {
      const messageMatch = line.match(messageRegex);
      if (messageMatch) {
        const messageIdHex = `0x${parseInt(messageMatch[1], 10).toString(16).toUpperCase()}`;
        currentMessage = {
          id: messageIdHex,
          name: messageMatch[2],
          length: messageMatch[3],
          transmitter: messageMatch[4],
          signals: []
        };
        messages.push(currentMessage);
      } else if (currentMessage && line.match(/^\s*SG_/)) {
        const signalMatch = line.match(signalRegex);
        if (signalMatch) {
          const startBit = parseInt(signalMatch[2], 10);
          const bitLength = parseInt(signalMatch[3], 10);
          const byteOrder = parseInt(signalMatch[4], 10);
          const adjustedStartBit = adjustStartBit(startBit, bitLength, byteOrder);

          const signal = {
            signalName: signalMatch[1],
            startBit: adjustedStartBit,
            bitLength: bitLength,
            byteOrder: byteOrder,
            sign: signalMatch[5],
            scale: parseFloat(signalMatch[6]),
            offset: parseFloat(signalMatch[7]),
            min: parseFloat(signalMatch[8]),
            max: parseFloat(signalMatch[9]),
            unit: signalMatch[10],
            transmitter: signalMatch[11],
            messageName: currentMessage.name
          };
          currentMessage.signals.push(signal);
        } else {
          console.log('Signal line did not match regex:', line);
        }
      }
    });
    return messages;
  }
};




// module.exports = {
//   parse: function (fileContent) {
//     const messages = [];
//     let currentMessage = null;

//     const messageRegex = /^BO_\s+(\d+)\s+(\w+):\s+(\d+)\s+(\w+)/;
//     const signalRegex = /^\s*SG_\s+(\w+)\s+:\s+(\d+)\|(\d+)@(\d+)([\+\-])\s?\(([\d\.]+),([\d\.]+)\)\s+\[([\d\.]+)\|([\d\.]+)\]\s+"(.*?)"\s+(\w+)/;

//     const lines = fileContent.split('\n');

//     lines.forEach((line, index) => {

//       const messageMatch = line.match(messageRegex);
//       if (messageMatch) {
//         currentMessage = {
//           id: messageMatch[1],
//           name: messageMatch[2],
//           length: messageMatch[3],
//           transmitter: messageMatch[4],
//           signals: []
//         };
//         messages.push(currentMessage);
//       } else if (currentMessage && line.match(/^\s*SG_/)) {
//         const signalMatch = line.match(signalRegex);
//         if (signalMatch) {
//           const signal = {
//             signalName: signalMatch[1],
//             startBit: signalMatch[2],
//             bitLength: signalMatch[3],
//             messageName: currentMessage.name 
//           };
//           currentMessage.signals.push(signal);
//         } else {
//           console.log('Signal line did not match regex:', line);
//         }
//       }
//     });

//     return messages;
//   }
// };


    



// Old Approach of parsing only messages not signals

// module.exports = {
//   parse: function (fileContent) {
//     const messages = [];
//     let currentMessage = null;

//     // Regular expressions for parsing messages and signals
//     const messageRegex = /^BO_\s+(\d+)\s+(\w+):\s+(\d+)\s+(\w+)/;
//     const signalRegex = /^\tSG_\s+(\w+)\s+:\s+(\d+)\|(\d+)@(\d+)([\+\-])\s?\(([\d\.]+),([\d\.]+)\)\s+\[([\d\.]+)\|([\d\.]+)\]\s+"(.*?)"\s+(\w+)/;

//     // Split file content by lines
//     const lines = fileContent.split('\n');

//     lines.forEach((line, index) => {
//       // Check for message line
//       if (line.startsWith('BO_')) {
//         const messageMatch = line.match(messageRegex);
//         if (messageMatch) {
//           // Create a new message object
//           currentMessage = {
//             id: messageMatch[1],
//             name: messageMatch[2],
//             length: messageMatch[3],
//             transmitter: messageMatch[4],
//             signals: []
//           };
//           messages.push(currentMessage);
//           console.log('Parsed message:', currentMessage);
//         }
//       }

//       // Check for signal lines following a message
//       if (currentMessage || line.startsWith('\tSG_')) {
//         const signalMatch = line.match(signalRegex);
//         if (signalMatch) {
//           // Create a new signal object and add it to the current message
//           const signal = {
//             name: `${currentMessage.name}_${signalMatch[1]}`, // Add message name to signal name
//             startBit: signalMatch[2],
//             bitLength: signalMatch[3],
//             byteOrder: signalMatch[4],
//             sign: signalMatch[5],
//             scale: signalMatch[6],
//             offset: signalMatch[7],
//             min: signalMatch[8],
//             max: signalMatch[9],
//             unit: signalMatch[10],
//             transmitter: signalMatch[11],
//             messageName: currentMessage.name // Add message name to signal object
//           };
//           currentMessage.signals.push(signal);
//           console.log('Parsed signal:', signal);
//         }
//       }
//     });

//     return messages;
//   }
// };
