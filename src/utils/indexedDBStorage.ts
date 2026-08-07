// IndexedDB storage utility for persisting uploaded portfolio page images across browser sessions

const DB_NAME = 'PortfolioImageStore';
const STORE_NAME = 'page_images';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'pageNum' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function savePageImageToDB(pageNum: number, file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ pageNum, dataUrl, timestamp: Date.now() });

        tx.oncomplete = () => resolve(dataUrl);
        tx.onerror = () => reject(tx.error);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function loadAllPageImagesFromDB(): Promise<Record<number, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as Array<{ pageNum: number; dataUrl: string }>;
        const result: Record<number, string> = {};
        items.forEach((item) => {
          if (item.pageNum && item.dataUrl) {
            result[item.pageNum] = item.dataUrl;
          }
        });
        resolve(result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch {
    return {};
  }
}
