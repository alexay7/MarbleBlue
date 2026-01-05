type XmlVarTypes =
    | "s8"
    | "u8"
    | "s16"
    | "u16"
    | "s32"
    | "u32"
    | "f32"
    | "f64"
	| "u64"
    | "bool"
    | "str"
	| "4u8"
	| "ip4";

export type SingleXmlVariableType<XmlVarType extends XmlVarTypes = XmlVarTypes> = {
    _: string;
    $: {
        __type: XmlVarType;
    }
}

export function xmlVar(value: string|number|undefined, type: XmlVarTypes): SingleXmlVariableType|string {
	if(value===undefined){
		return "";
	}

	return {
		_: `${value}`,
		$: {
			__type: type,
		},
	};
}

// Function to get the value of an XmlVariableType
export function v(xmlObj: SingleXmlVariableType): string {
	return xmlObj._;
}