import { verify, decode } from 'jsonwebtoken';

export default function verifyJwt(token, key) {
  if (process.env.JWT_MODE === 'decode') {
    return decode(token);
  }

  return new Promise((resolve, reject) => {
    verify(token, key, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
}
