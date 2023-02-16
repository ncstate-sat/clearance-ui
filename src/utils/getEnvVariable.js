export default (name) => window.ENV_VARIABLES?.[name] || import.meta.env[name];
