export async function resolve(specifier, context, defaultResolve) {
	if (specifier.startsWith("@shared/")) {
		const newPath = specifier.replace("@shared/", `file://${process.cwd()}/../`);
		return defaultResolve(newPath, context, defaultResolve);
	}
	if (specifier.startsWith("@src/")) {
		const newPath = specifier.replace("@src/", `file://${process.cwd()}/src/`);
		return defaultResolve(newPath, context, defaultResolve);
	}
	if (specifier.startsWith("@root/")) {
		const newPath = specifier.replace("@root/", `file://${process.cwd()}/`);
		return defaultResolve(newPath, context, defaultResolve);
	}
	return defaultResolve(specifier, context, defaultResolve);
}
