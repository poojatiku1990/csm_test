import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: 'f8d9f0d7ea144f50b744e134497e495e'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '1252ef10e65542ffa8910366dab1de34'
                    }
                }
                composite: [
                    {
                        table: 'sn_glider_source_artifact'
                        id: '207ba906b43c4e3d991383670ca75908'
                        key: {
                            name: 'x_20261805_csm_incident_manager.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '20b18f7ce97847fda1c130d1d15590ac'
                        key: {
                            name: 'x_20261805_csm/main.js.map'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '2ca32498dffa454f8c162495ab66c6c3'
                        key: {
                            application_file: 'de7c62eb861b41ee83a73aa75a0bfaf4'
                            source_artifact: '207ba906b43c4e3d991383670ca75908'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '76b8ac2644b0460788a679bc0bf6eed0'
                        key: {
                            application_file: '20b18f7ce97847fda1c130d1d15590ac'
                            source_artifact: '207ba906b43c4e3d991383670ca75908'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '9ee4531cc1dd49149d645e1dcde10fa9'
                        key: {
                            endpoint: 'x_20261805_csm_incident_manager.do'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'c1b1b7f7d6884708a124b4fed40b3833'
                        key: {
                            application_file: '9ee4531cc1dd49149d645e1dcde10fa9'
                            source_artifact: '207ba906b43c4e3d991383670ca75908'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'de7c62eb861b41ee83a73aa75a0bfaf4'
                        key: {
                            name: 'x_20261805_csm/main'
                        }
                    },
                ]
            }
        }
    }
}
