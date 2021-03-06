/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { Uri } from 'vscode';
import { IPullRequestModel } from '../github/interface';

export interface ReviewUriParams {
	path: string;
	ref?: string;
	commit?: string;
	base: boolean;
}

export function fromReviewUri(uri: Uri): ReviewUriParams {
	return JSON.parse(uri.query);
}

export interface PRUriParams {
	commit?: string;
	base: boolean;
	fileName: string;
	prNumber: number;
}

export function fromPRUri(uri: Uri): PRUriParams {
	return JSON.parse(uri.query);
}

export interface GitUriOptions {
	replaceFileExtension?: boolean;
	submoduleOf?: string;
	base: boolean;
}

// As a mitigation for extensions like ESLint showing warnings and errors
// for git URIs, let's change the file extension of these uris to .git,
// when `replaceFileExtension` is true.
export function toReviewUri(uri: Uri, filePath: string, ref: string, commit: string, options: GitUriOptions): Uri {
	const params: ReviewUriParams = {
		path: filePath ? filePath : uri.path,
		ref,
		commit: commit,
		base: options.base
	};

	let path = uri.path;

	if (options.replaceFileExtension) {
		path = `${path}.git`;
	}

	return uri.with({
		scheme: 'review',
		path,
		query: JSON.stringify(params)
	});
}



export interface FileChangeNodeUriParams {
	hasComments?: boolean;
}

export function toFileChangeNodeUri(uri: Uri, hasComments: boolean) {
	const params = {
		hasComments: hasComments
	}

	return uri.with({
		scheme: 'file',
		query: JSON.stringify(params)
	})
}

export function fromFileChangeNodeUri(uri: Uri): FileChangeNodeUriParams {
	try {
		return JSON.parse(uri.query) as FileChangeNodeUriParams;
	} catch (e) {
		return null;
	}
}

export function toPRUri(uri: Uri, pullRequestModel: IPullRequestModel, commit: string, fileName: string, base: boolean): Uri {
	const params: PRUriParams = {
		commit: commit,
		base: base,
		fileName: fileName,
		prNumber: pullRequestModel.prNumber
	};

	let path = uri.path;

	return uri.with({
		scheme: 'pr',
		path,
		query: JSON.stringify(params)
	});
}
