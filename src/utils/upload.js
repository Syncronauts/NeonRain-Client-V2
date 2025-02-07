import { notifications } from 'fantom-vue-components/src/plugins/notifications.js';
import { artionFApolloClient } from '@/plugins/apollo/apollo-provider.js';
import { getBearerToken } from '@/modules/account/auth.js';

/**
 * @param {File[]} _files
 * @param {string} _type
 * @return {Promise<boolean>}
 */
export async function uploadUserFile(_files, _type = 'avatar') {
    if (!_files[0]) {
        return false;
    }

    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + getBearerToken(),
        },
    };

    let data = new FormData();
    data.append('file', _files[0]);
    options.body = data;

    let url = artionFApolloClient.httpProviderOrigin + '/upload-image/user-' + _type;

    try {
        let response = await fetch(url, options);
        console.log(response);
        if (response.status === 200) {
            notifications.add({
                type: 'success',
                text: `You successfully upload your ${_type}`,
            });

            return true;
        }

        return false;
    } catch (err) {
        notifications.add({
            type: 'error',
            text: `Sorry, something went wrong. Your ${_type} wasn't uploaded`,
        });

        return false;
    }
}

export async function uploadTokenData(_metadata, _imageFile) {
    let data = new FormData();
    data.append('file', _imageFile);
    data.append('metadata', JSON.stringify(_metadata));
    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + getBearerToken(),
        },
        body: data,
    };

    let url = artionFApolloClient.httpProviderOrigin + '/upload-image/token';

    let response = await fetch(url, options);
    console.log(response);
    if (response.status === 200) {
        return await response.text();
    } else {
        throw await response.text();
    }
}

export async function uploadCollection(_data, _imageFile) {
    let data = new FormData();
    data.append('data', JSON.stringify(_data));
    data.append('file', _imageFile);
    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + getBearerToken(),
        },
        body: data,
    };

    let url = artionFApolloClient.httpProviderOrigin + '/upload-image/collection';

    let response = await fetch(url, options);
    console.log(response);
    if (response.status === 200) {
        return await response.text();
    } else {
        throw await response.text();
    }
}
